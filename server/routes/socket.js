// const chatSocket = require('../controller/Cchat').chatSocket;
// const io = req.app.get('io'); // 전역변수로 등록해논 io객체를 가져옴
// 미들웨어 설정
const authSocketUtil = require('../middlewares/authSocket.js');
const redisCli = require('../models/redis').redis_Cli;
const sub = require('../models/redis.js').sub;
const userSocketMap = {};

// 내림차순 정렬 위한 함수
function personRoom(uSeq, targetSeq) {
  const a = Math.min(uSeq, targetSeq);
  const b = Math.max(uSeq, targetSeq);

  return `room${a}w${b}`;
}

exports.chatSocket = async (io, socket) => {
  try {
    // 네임스페이스 생성(모임챗) - 룸: 각 모임별 챗
    // Express의 라우팅처럼 url에 지정된 위치에 따라 신호의 처리를 다르게 하는 기술(특정 페이지에서 소켓이 보내주는 모든 실시간 메세지를 받을 필요는 없다)
    // Room은 namespace의 하위개념에 해당.(카톡 단톡방 1, 단톡방 2...)
    const groupChat = io.of(`/api/chat`);
    groupChat.use(authSocketUtil.checkToken);

    // 네임스페이스에 이벤트 리스너 등록
    groupChat.on('connection', async (socket) => {
      try {
        let userInfo = socket.userInfo;

        const { uName, uSeq, socketId, gSeq } = userInfo;
        console.log('현재 접속중인 유저', userInfo);
        console.log(
          `/api/chat 네임스페이스 연결 완료, 접속시간 ${socketId}::: `
        );
        userSocketMap[uSeq] = socketId;
        console.log('userSocketMap', userSocketMap);

        // redis에 사용자 정보 캐시로 저장 (hash)
        // 이미 로그인되어 있는 경우에는 update하지 않음.
        const isConnected = await redisCli.hGet(`socket${uSeq}`, 'uName');
        if (!isConnected) {
          console.log('이미 로그인되어 있지 않음');
          await redisCli.hSet(`socket${uSeq}`, 'uSeq', uSeq);
          await redisCli.hSet(`socket${uSeq}`, 'gSeq', JSON.stringify(gSeq));
          await redisCli.hSet(`socket${uSeq}`, 'uName', uName);
          await redisCli.hSetNX(
            `socket${uSeq}`,
            'loginTime',
            new Date().toString()
          );
        }
        // 만료시간 설정
        await redisCli.expire(`socket${uSeq}`, 86400); // 24시간

        // 1대1 참가방 추출하고 각 방 참가시킴.
        const targetSeqArray = await redisCli.sMembers(`user${uSeq}`);
        targetSeqArray.map((seq) => socket.join(personRoom(uSeq, seq)));

        // 방참가하기
        if (Array.isArray(gSeq)) {
          gSeq.map((info) => {
            socket.join(`room${info}`);
          });
        } else {
          console.log(`gSeq is not Array111!`);
          return;
        }

        // 최초 로그인시간 정보 입력
        const loginTime = await redisCli.hGet(`socket${uSeq}`, 'loginTime');
        userInfo.loginTime = new Date(loginTime);

        // 모임별 채팅방 입장시
        socket.on('joinRoom', async (data) => {
          try {
            // 1. 모임가입/ 모임생성시 : 방참여/ gSeq 추가
            if (data.isSignup === 'true') {
              // gSeq 배열 추가
              userInfo.gSeq.push(...Number(data.gSeq));
              // 캐시 update
              await redisCli.hSet(
                `socket${uSeq}`,
                'gSeq',
                JSON.stringify(userInfo.gSeq)
              );

              console.log('모임가입 후 userInfo>>>>>>>', userInfo);
              // 해당 모임방에 참여한 사람들에게 알림 전송
              socket.join(`room${data.gSeq}`);
              socket.to(`room${data.gSeq}`).emit('loginNotice', {
                msg: `${uName}님이 모임에 참여하셨어요!`,
              });
            } else {
              // 2. 이미 가입되어 있는 경우 채팅방 입장.

              // gSeq가 배열이 아닐경우(모임방 입장+모임그룹이 1개)
              if (Array.isArray(data.gSeq) !== true) {
                const gSeq = data.gSeq;

                let userDatas = [];

                const result = groupChat.adapter.rooms.get(`room${gSeq}`);
                console.log('룸 소켓 목록>>>>>>>>>>>>>>>', result);

                const socketsInRoom = Array.from(
                  groupChat.adapter.rooms.get(`room${gSeq}`) || []
                );
                console.log(socketsInRoom);
                // for (let id of socketsInRoom) {
                //   userDatas.push(await redisCli.hGetAll(`${id}`));
                // }
                // 일치하는 uSeq 찾기.
                const uSeqs = socketsInRoom.map((socketId) =>
                  Object.keys(userSocketMap).find(
                    (uSeq) => userSocketMap[uSeq] === socketId
                  )
                );
                // room에 참가하고 있는 소켓의 정보를 담은 배열(forEach의 경우에는 배열의 모든 값에 대해 await 해주지않음!)
                const userDatasPromises = uSeqs.map(
                  async (uSeq) => await redisCli.hGetAll(`socket${uSeq}`)
                );
                userDatas = await Promise.all(userDatasPromises);

                const uNameInRoom = userDatas.map((user) => user.uName);
                console.log(`room${gSeq}에 접속된 아이디 목록`, uNameInRoom);

                // 사용자가 접속한 이후의 메시지만을 가져옴
                // LLEN을 사용하여 리스트의 길이(메시지 개수)
                const listLength = await redisCli.lLen(`room${gSeq}`);
                if (listLength !== 0) {
                  const messages = await redisCli.lRange(`room${gSeq}`, 0, -1);
                  // 가져온 메시지를 파싱
                  const parsedMessages = messages
                    .map((message) => JSON.parse(message))
                    .filter(
                      (parsedMessage) =>
                        new Date(parsedMessage.timeStamp) >= userInfo.loginTime
                    );

                  socket.emit('joinRoom', {
                    allMsg: parsedMessages,
                  });
                  socket.emit('loginUser', {
                    loginUser: userDatas,
                  });
                } else {
                  //room data가 없는경우
                  socket.emit('joinRoom', {
                    allMsg: '모임방 메세지 없음!',
                  });
                  socket.emit('loginUser', {
                    loginUser: userDatas,
                  });
                }
              } else {
                for (const gSeq of data.gSeq) {
                  let userDatas = [];
                  console.log('rooms목록: ', groupChat.adapter.rooms);
                  // 룸에 접속중인 소켓 로드 (접속중인 소켓 없을 때는 빈 배열 반환)
                  const result = groupChat.adapter.rooms.get(`room${gSeq}`);
                  console.log('룸 소켓 목록>>>>>>>>>>>>>>>', result);

                  const socketsInRoom = Array.from(
                    groupChat.adapter.rooms.get(`room${gSeq}`) || []
                  );
                  console.log(socketsInRoom);
                  // for (let id of socketsInRoom) {
                  //   userDatas.push(await redisCli.hGetAll(`${id}`));
                  // }
                  // 일치하는 uSeq 찾기.
                  const uSeqs = socketsInRoom.map((socketId) =>
                    Object.keys(userSocketMap).find(
                      (uSeq) => userSocketMap[uSeq] === socketId
                    )
                  );
                  // room에 참가하고 있는 소켓의 정보를 담은 배열(forEach의 경우에는 배열의 모든 값에 대해 await 해주지않음!)
                  const userDatasPromises = uSeqs.map(
                    async (uSeq) => await redisCli.hGetAll(`socket${uSeq}`)
                  );
                  userDatas = await Promise.all(userDatasPromises);

                  const uNameInRoom = userDatas.map((user) => user.uName);
                  console.log(`room${gSeq}에 접속된 아이디 목록`, uNameInRoom);
                  socket.to(`room${gSeq}`).emit('loginUser', {
                    loginUser: userDatas,
                  });
                }
              }
            }
          } catch (err) {
            console.log('joinRoomError', err);
          }
        });

        // 1대 1 채팅(모임별 채팅방에서 클릭시 또는 chatlist에서 클릭시)
        socket.on('DM', async (data) => {
          try {
            const targetSeq = data.targetSeq;
            // 클릭시 대화방(room${uSeq}p) 입장
            socket.join(personRoom(uSeq, targetSeq));

            let isLogin = userSocketMap[targetSeq] || false;

            // 대화내역 load : list
            const listLength = await redisCli.lLen(personRoom(uSeq, targetSeq));
            if (listLength !== 0) {
              const messages = await redisCli.lRange(`room${gSeq}`, 0, -1);
              // 가져온 메시지를 파싱
              const parsedMessages = messages.map((message) =>
                JSON.parse(message)
              );
              socket.emit('DM', {
                allMsg: parsedMessages,
                isLogin,
              });
            } else {
              socket.emit('DM', {
                allMsg: '주고받은 메세지가 없어요. 대화를 시작해보세요!',
                isLogin,
              });
            }
          } catch (err) {
            console.error('DM error', err);
          }
        });

        // 메세지보내기
        socket.on('sendMsg', async (data) => {
          try {
            // 자료구조 : lists (데이터를 순서대로 저장)
            // 추가 / 삭제 / 조회하는 것은 O(1)의 속도
            // 닉네임(socketId)/시간/룸/targetSeq 가 null 일경우에는 전체
            const { uSeq, uName, timeStamp, msg, gSeq, targetSeq } = data;

            // 모임별채팅의 경우
            if (!targetSeq) {
              // 메세지 정보 redis에 저장
              await redisCli.lPush(
                `room${gSeq}`,
                JSON.stringify({ msg, timeStamp, uSeq, gSeq, uName })
              );

              // publisher setting
              await redisCli.publish(
                `newMsg${gSeq}`,
                JSON.stringify({
                  gSeq,
                  content: {
                    msg,
                    timeStamp,
                    uName,
                  },
                })
              );

              // 메세지 유효시간 : 마지막 메세지를 받은 때로부터 12시간
              await redisCli.expire(`room${gSeq}`, 43200);

              socket
                .to(`room${gSeq}`)
                .emit('msg', { uName, uSeq, timeStamp, msg });
            } else {
              // 1대1 채팅인 경우(자료구조: 리스트로 저장)
              // 1. 상대가 로그인되어 있을 때 - 메세지 개수 localstorage 로 관리
              await redisCli.lPush(
                personRoom(uSeq, targetSeq),
                JSON.stringify({ uSeq, msg, timeStamp, uName, targetSeq })
              );
              // 채팅방 내역이 있는지 여부 확인 위한 seq 배열 저장 (자료구조 : sets 이용)
              await redisCli.sADD(`user${targetSeq}`, uSeq);

              // 채팅방의 가장 마지막 메세지로 세팅
              await redisCli.hSet(
                `user${targetSeq}`,
                `msg${uSeq}`,
                JSON.stringify({ uSeq, msg, timeStamp, uName })
              );

              // 상대가 로그인되어 있지 않을 때 - redis hash로 관리 : field(senderId)
              if (!userSocketMap[targetSeq]) {
                // 기존에 안읽은 메세지가 없을 경우 1 설정
                await redisCli.hSetNX(`user${targetSeq}`, `count${uSeq}`, 1);
                // 안읽은 메세지가 있을 경우 +1
                await redisCli.hIncrBy(`user${targetSeq}`, `count${uSeq}`, 1);
              }

              // 메세지 유효시간 : 마지막 메세지 받은 때로부터 7일
              await redisCli.expire(personRoom(uSeq, targetSeq), 604800);

              socket
                .to(personRoom(uSeq, targetSeq))
                .emit('msg', { uName, uSeq, timeStamp, msg, targetSeq });

              console.log('Whisper sent successfully to', targetSeq);
            }
          } catch (err) {
            console.error('sendMsg error', err);
          }
        });

        // 구독자설정(로컬스토리지 개수 + 1)
        userInfo.gSeq.forEach((gSeq) => {
          sub.subscribe(`newMsg${gSeq}`, (data) => {
            const datas = JSON.parse(data);
            const gSeq = datas.gSeq;
            const content = datas.content;

            socket.emit('newMsg', { gSeq, content });
          });
        });

        // 모임탈퇴, 추방시 모임채팅 out
        socket.on('roomOut', async (data) => {
          try {
            const gSeq = data.gSeq;

            console.log(groupChat.adapter.rooms);
            // 저장된 캐시 update
            userInfo.gSeq = userInfo.gSeq.filter((seq) => seq !== gSeq);

            await redisCli.hSet(
              `socket${uSeq}`,
              'gSeq',
              JSON.stringify(userInfo.gSeq)
            );

            socket.to(`room${gSeq}`).emit('msg', {
              msg: `${uName}님이 모임을 탈퇴하셨습니다.`,
            });
            console.log(`room${gSeq} leave!!!`);
            socket.leave(`room${gSeq}`);
          } catch (err) {
            console.error('roomOut error', err);
          }
        });

        // 각 모임방에 notice
        socket.on('logout', async (data) => {
          try {
            console.log('User logged out:', socketId);
            // 유저 캐시 삭제
            await redisCli.del(`socket${uSeq}`);
            // userSocketMap 객체에서 특정 uSeq 키값을 삭제
            delete userSocketMap[uSeq];

            for (const gSeq of data.gSeq) {
              let userDatas = [];
              console.log('rooms목록: ', groupChat.adapter.rooms);
              // 룸에 접속중인 소켓 로드 (접속중인 소켓 없을 때는 빈 배열 반환)
              const result = groupChat.adapter.rooms.get(`room${gSeq}`);
              console.log('룸 소켓 목록>>>>>>>>>>>>>>>', result);

              const socketsInRoom = Array.from(
                groupChat.adapter.rooms.get(`room${gSeq}`) || []
              );
              console.log(socketsInRoom);
              // for (let id of socketsInRoom) {
              //   userDatas.push(await redisCli.hGetAll(`${id}`));
              // }
              // 일치하는 uSeq 찾기.
              const uSeqs = socketsInRoom.map((socketId) =>
                Object.keys(userSocketMap).find(
                  (uSeq) => userSocketMap[uSeq] === socketId
                )
              );
              // room에 참가하고 있는 소켓의 정보를 담은 배열(forEach의 경우에는 배열의 모든 값에 대해 await 해주지않음!)
              const userDatasPromises = uSeqs.map(
                async (uSeq) => await redisCli.hGetAll(`socket${uSeq}`)
              );
              userDatas = await Promise.all(userDatasPromises);

              const uNameInRoom = userDatas.map((user) => user.uName);
              console.log(
                `room${gSeq}에 접속된 아이디 목록>>>>>>>>>>>>>>>>`,
                uNameInRoom
              );
              socket.to(`room${gSeq}`).emit('loginUser', {
                loginUser: userDatas,
              });
            }

            socket.disconnect();
            console.log('남은 유저', userSocketMap);
          } catch (err) {
            console.log('logout err', err);
          }
        });

        // 연결이 끊어질 때 연결된 소켓 목록에서 제거
        socket.on('disconnect', () => {
          console.log(`Socket ${socketId} disconnected.`);
          console.log('현재 접속되어 있는 유저', userSocketMap);
          console.log('현재 접속되어 있는 유저/룸', groupChat.adapter.rooms);
          // 각 모임방에 notice
        });
      } catch (err) {
        console.error('io 통신 error', err);
      }
    });
  } catch (err) {
    console.log('socket 통신 error', err);
  }
};
