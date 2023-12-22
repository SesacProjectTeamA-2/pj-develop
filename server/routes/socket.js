// const chatSocket = require('../controller/Cchat').chatSocket;
// const io = req.app.get('io'); // 전역변수로 등록해논 io객체를 가져옴
// 미들웨어 설정
const authSocketUtil = require('../middlewares/authSocket.js');
const redisCli = require('../models/redis').redis_Cli;
const userSocketMap = {};

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
        const userInfo = socket.userInfo;
        // 모임별 안읽은 메세지 개수
        const messageCount = [];
        const roomInfoArray = [];
        const { uName, uSeq, socketId, gSeq } = userInfo;
        console.log('현재 접속중인 유저', userInfo);
        console.log(
          `/api/chat 네임스페이스 연결 완료, 접속시간 ${socketId}::: `
        );
        userSocketMap[uSeq] = socketId;
        console.log('userSocketMap', userSocketMap);

        // redis에 사용자 정보 캐시로 저장 (hash)
        // 이미 로그인되어 있는 경우에는 update하지 않음.
        const isConnected = await redisCli.hGet(`user${uSeq}`, 'uName');
        if (isConnected) {
          await redisCli.hSet(`user${uSeq}`, 'uName', uName);
          await redisCli.hSetNX(
            `user${uSeq}`,
            'loginTime',
            new Date().toString()
          );
          await redisCli.hSet(`user${uSeq}`, 'gSeq', JSON.stringify(gSeq));
        }

        // 새로발급받은 소켓아이디 저장
        await redisCli.hSet(`user${uSeq}`, 'socketId', socketId);

        // 방참가하기
        if (Array.isArray(gSeq)) {
          gSeq.map((info) => {
            const isExisting = groupChat.adapter.rooms.has(`room${info}`);
            console.log(`room${info} 현재 생성되어 있음?`, isExisting);
            socket.join(`room${info}`);
          });
        } else {
          console.log(`gSeq is not Array!`);
          return;
        }

        // 로그인시 각 방에 참여 및 로그인 이후 메세지 개수
        socket.on('login', async (data) => {
          try {
            if (Array.isArray(data.gSeq)) {
              data.gSeq.map((info) => {
                const isExisting = groupChat.adapter.rooms.has(`room${info}`);
                console.log(`room${info} 현재 생성되어 있음?`, isExisting);
                // 방에 참가 및 notice
                groupChat.to(`room${info}`).emit('loginNotice', {
                  msg: `${uName}님이 로그인하셨어요`,
                });
              });
            } else {
              console.log(`gSeq is not Array!`);
              return;
            }
            socket.emit('loginSuccess', {
              msg: `${uName}님이 로그인하셨어요`,
              userInfo,
            });
          } catch (err) {
            console.error(err);
          }
        });

        // 모임별 채팅에 대한 정보
        socket.on('roomInfo', async () => {
          try {
            console.log(connectedUser);
            console.log('userinfo.gSeq>>>>', loginUser);

            // 1. 모임의 마지막 메세지 정보 송출
            if (Array.isArray(loginUser.gSeq)) {
              // 아래와같이 사용할 경우, map이 끝날때까지 기다리지 않음 => map에 대한 동작을 변수로 할당해 promise.all() 사용해야한다.
              // userInfo.gSeq.map(async (info) => {
              //   const message = await redisCli.lRange(`room${info}`, -1, -1);
              //   socket.emit('roomInfo', JSON.parse(message));});

              for (const info of loginUser.gSeq) {
                const listLength = await redisCli.lLen(`room${info}`);
                if (listLength !== 0) {
                  const message = await redisCli.lRange(`room${info}`, -1, -1);
                  const roomInfo = { gSeq: info, msg: JSON.parse(message) };
                  roomInfoArray.push(roomInfo);
                } else {
                  console.log(`room${info}에 아직 메세지가 없음!`);
                }
              }
              console.log('roomInfoArray>>>', roomInfoArray);
              // 2. 안읽은 메세지 갯수

              socket.emit('roomInfo', roomInfoArray);
            } else {
              console.log(`gSeq is not Array!`);
              return;
            }
          } catch (err) {
            console.error('roomInfo 에러', err);
          }
        });

        // 모임별 채팅방 입장시
        socket.on('joinRoom', async (data) => {
          try {
            console.log('joinroom data>>>>>>>>>', data);
            console.log(io.sockets.adapter.rooms.get(`room${data.gSeq}`));
            // 1. 모임가입/ 모임생성시 : 방참여/ gSeq 추가
            if (data.isSignup === 'true') {
              // connectedUser에서 해당 userInfo 찾기
              // const index = connectedUser.findIndex(
              //   (user) => user.uSeq === userInfo.uSeq
              // );
              // gSeq 배열 추가
              loginUser.gSeq.push(...Number(data.gSeq));
              // connectedUser[index] = userInfo;
              console.log('모임가입 후 userInfo>>>>>>>', loginUser);
              // 해당 모임방에 참여한 사람들에게 알림 전송
              socket.join(`room${data.gSeq}`);
              groupChat.to(`room${data.gSeq}`).emit('loginNotice', {
                msg: `${uName}님이 모임에 참여하셨어요!`,
              });
            } else {
              // 2. 이미 가입되어 있는 경우 채팅방 입장.
              const gSeq = data.gSeq;
              console.log('rooms목록: ', groupChat.adapter.rooms);
              // 룸에 접속중인 소켓 로드 (접속중인 소켓 없을 때는 빈 배열 반환)
              const result = groupChat.adapter.rooms.get(`room${gSeq}`);
              console.log(result);
              const socketsInRoom = Array.from(
                groupChat.adapter.rooms.get(`room${gSeq}`) || []
              );
              const arrayInRoom = connectedUser.filter((user) =>
                socketsInRoom.includes(user.socketId)
              );
              console.log(arrayInRoom);
              const uNameInRoom = arrayInRoom.map((user) => user.uName);

              console.log(`room${gSeq}에 접속된 아이디 목록`, uNameInRoom);

              // 사용자가 접속한 이후의 메시지만을 가져옴
              // LLEN을 사용하여 리스트의 길이(메시지 개수)
              const listLength = await redisCli.lLen(`room${gSeq}`);
              if (listLength !== 0) {
                const messages = await redisCli.lRange(`room${gSeq}`, 0, -1);
                // 가져온 메시지를 파싱
                console.log(messages);
                const parsedMessages = messages
                  .map((message) => JSON.parse(message))
                  .filter(
                    (parsedMessage) =>
                      new Date(parsedMessage.timeStamp) >= loginUser.loginTime
                  );
                console.log('파싱된 메세지', parsedMessages);

                socket.emit('joinRoom', {
                  allMsg: parsedMessages,
                  loginUser: uNameInRoom,
                });
              } else {
                //room data가 없는경우
                socket.emit('joinRoom', {
                  allMsg: '모임방 메세지 없음!',
                  loginUser: uNameInRoom,
                });
              }
            }
          } catch (err) {
            console.log('joinRoomError', err);
          }
        });

        // 메세지보내기
        socket.on('sendMsg', async (data) => {
          try {
            // 자료구조 : lists (데이터를 순서대로 저장)
            // 추가 / 삭제 / 조회하는 것은 O(1)의 속도
            // 닉네임(socketId)/시간/룸/targetSeq 가 0 일경우에는 전체
            const { uSeq, timeStamp, msg, gSeq, targetSeq } = data;
            const roomChat = groupChat.to(`room${gSeq}`);
            const result = JSON.stringify({ msg, timeStamp, uSeq });

            // 메세지 정보 redis에 저장
            await redisCli.lPush(
              `room${gSeq}`,
              JSON.stringify({ msg, timeStamp, uSeq, gSeq })
            );

            // 만료시간 조회
            const expirationTime = await redisCli.ttl(`user${uSeq}`);
            // 메세지 유효시간 : 12시간
            if (expirationTime > 0) {
              console.log('이미 만료시간 설정되어 있음!');
            } else {
              await redisCli.expire(`room${gSeq}`, 43200);
            }

            roomChat.emit('msg', { uName, uSeq, timeStamp, msg });

            // 귓속말인 경우(자료구조: 리스트로 저장)
            // if (targetSeq !== 0) {
            //   const targetId = userSocketMap[targetSeq]

            //     io.to(targetId).emit('whisper', {
            //       uName,
            //       uSeq,
            //       timeStamp,
            //       msg,
            //     });
            //     console.log('Whisper sent successfully to', targetSeq);

            //     await redisCli.hSet(``)

            //   } else {
            //     console.log('Target user is not online or does not exist');
            //   }
            // }

            console.log('msg 전송 성공 !!!! ', result);
          } catch (err) {
            console.error('sendMsg error', err);
          }
        });

        // 모임탈퇴, 추방시 모임채팅 out
        socket.on('roomOut', async (data) => {
          try {
            const gSeq = data.gSeq;
            const roomChat = groupChat.to(`room${gSeq}`);

            console.log(groupChat.adapter.rooms);

            roomChat.emit('msg', {
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
            const fieldsToDelete = ['uName', 'loginTime', 'gSeq', 'socketId'];
            for (const field of fieldsToDelete) {
              await redisCli.hDel(`user${uSeq}`, field);
            }

            // userSocketMap 객체에서 특정 uSeq 키값을 삭제
            delete userSocketMap[uSeq];
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
