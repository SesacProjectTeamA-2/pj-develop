// const chatSocket = require('../controller/Cchat').chatSocket;
// const io = req.app.get('io'); // 전역변수로 등록해논 io객체를 가져옴
// 미들웨어 설정
const authSocketUtil = require('../middlewares/authSocket.js');
const redisCli = require('../models/redis');
const { connect } = require('./user.js');

exports.chatSocket = async (io, socket) => {
  try {
    // 네임스페이스 생성(모임챗) - 룸: 각 모임별 챗
    // Express의 라우팅처럼 url에 지정된 위치에 따라 신호의 처리를 다르게 하는 기술(특정 페이지에서 소켓이 보내주는 모든 실시간 메세지를 받을 필요는 없다)
    // Room은 namespace의 하위개념에 해당.(카톡 단톡방 1, 단톡방 2...)
    const groupChat = io.of(`/api/chat`);
    groupChat.use(authSocketUtil.checkToken);

    const connectedUser = []; // 연결된 클라이언트를 저장할 객체

    // 네임스페이스에 이벤트 리스너 등록
    groupChat.on('connection', async (socket) => {
      try {
        const userInfo = socket.userInfo;
        // 모임별 안읽은 메세지 개수
        const messageCount = [];

        // 중복된 uSeq를 가진 객체가 배열에 있는지 확인
        const isDuplicate = connectedUser.some(
          (user) => user.uSeq === userInfo.uSeq
        );

        // 중복이 아닌 경우에만 추가(최초로그인시간으로 저장됨)
        if (isDuplicate) {
          console.log(
            '이미 연결되어 있는 소켓이 있음!!',
            console.log('현재 소켓아이디>>', socket.id)
          );
        } else {
          connectedUser.push({
            uSeq: userInfo.uSeq,
            uName: userInfo.uName,
            loginTime: userInfo.loginTime,
            gSeq: [],
          });
        }

        const { uName, uSeq, loginTime, socketId } = userInfo;

        console.log('현재 접속중인 유저', connectedUser);

        console.log(
          `/api/chat 네임스페이스 연결 완료, 접속시간 ${loginTime}::: `,
          socketId
        );

        // 접속된 유저의 정보꺼내기
        // connectedUser 배열에서 userInfo의 uSeq와 동일한 키값을 가진 객체 찾기
        const loginUser = connectedUser.find(
          (user) => user.uSeq === userInfo.uSeq
        );
        if (loginUser) {
          console.log('로그인 유저 정보 : ', loginUser);
        } else {
          // 해당하는 객체를 찾지 못한 경우
          console.log('User not found');
        }

        // 로그인시 각 방에 참여 및 로그인 이후 메세지 개수
        socket.on('login', (data) => {
          try {
            loginUser.gSeq = data.gSeq;
            console.log(userInfo);

            if (Array.isArray(data.gSeq)) {
              data.gSeq.map((info) => {
                const isExisting = groupChat.adapter.rooms.has(`room${info}`);
                console.log(`room${info} 현재 생성되어 있음?`, isExisting);
                // 방에 참가 및 notice
                socket.join(`room${info}`);
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
            console.log('userinfo.gSeq>>>>', loginUser);

            // 1. 모임의 마지막 메세지 정보 송출
            if (Array.isArray(loginUser.gSeq)) {
              // 아래와같이 사용할 경우, map이 끝날때까지 기다리지 않음 => map에 대한 동작을 변수로 할당해 promise.all() 사용해야한다.
              // userInfo.gSeq.map(async (info) => {
              //   const message = await redisCli.lRange(`room${info}`, -1, -1);
              //   socket.emit('roomInfo', JSON.parse(message));});

              const roomInfoArray = [];

              for (const info of loginUser.gSeq) {
                const listLength = await redisCli.lLen(`room${gSeq}`);
                if (listLength !== 0) {
                  const message = await redisCli.lRange(`room${info}`, -1, -1);
                  const roomInfo = { gSeq: info, msg: JSON.parse(message) };
                  roomInfoArray.push(roomInfo);
                } else {
                  console.log(`room${gSeq}에 아직 메세지가 없음!`);
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
            // 1. 모임가입/ 모임생성시 : 방참여/ gSeq 추가
            if (data.isSignup === 'true') {
              // connectedUser에서 해당 userInfo 찾기
              // const index = connectedUser.findIndex(
              //   (user) => user.uSeq === userInfo.uSeq
              // );
              // gSeq 배열 추가
              loginUser.gSeq.push(data.gSeq);
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

        socket.on('sendMsg', async (data) => {
          try {
            // 자료구조 : lists (데이터를 순서대로 저장)
            // 추가 / 삭제 / 조회하는 것은 O(1)의 속도
            // 닉네임(socketId)/시간/룸/
            const { uSeq, timeStamp, msg, gSeq, socketId } = data;
            const roomChat = groupChat.to(`room${gSeq}`);
            const result = JSON.stringify({ msg, timeStamp, uSeq });

            // 메세지 정보 redis에 저장
            await redisCli.lPush(
              `room${gSeq}`,
              JSON.stringify({ msg, timeStamp, uSeq })
            );
            // 메세지 유효시간 : 12시간
            await redisCli.expire(`room${gSeq}`, 43200);
            roomChat.emit('msg', { uName, socketId, timeStamp, msg });

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

            // loginUser의 gSeq 배열에서 data.gSeq와 동일한 값을 제외한 새로운 배열 생성
            loginUser.gSeq = loginUser.gSeq.filter(
              (gSeqValue) => gSeqValue !== data.gSeq
            );
            console.log(loginUser);
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
        socket.on('logout', (data) => {
          try {
            // 해당 소켓에 대한 정보를 connectedUser 배열에서 찾아 제거
            console.log('User logged out:', socketId);
            // // connectedUser 배열에서 uSeq가 일치하는 객체 찾기
            // const userIndex = connectedUser.findIndex(
            //   (user) => user.uSeq === uSeq
            // );

            // if (userIndex !== -1) {
            //   // 해당 객체를 배열에서 제거
            //   connectedUser.splice(userIndex, 1);
            // }

            const loginUser = connectedUser.filter(
              (user) => user.uSeq !== uSeq
            );
            // connectedUser 배열에서 uSeq가 일치하는 객체를 모두 제거
            for (let i = loginUser.length - 1; i >= 0; i--) {
              if (loginUser[i].uSeq === uSeq) {
                loginUser.splice(i, 1);
              }
            }
            socket.disconnect();

            console.log('남은 유저', connectedUser);
          } catch (err) {
            console.log('logout err', err);
          }
        });

        // 연결이 끊어질 때 연결된 소켓 목록에서 제거
        socket.on('disconnect', () => {
          console.log(`Socket ${socketId} disconnected.`);
          console.log('현재 접속되어 있는 유저', connectedUser);
          console.log('현재 접속되어 있는 유저', groupChat.adapter.rooms);
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
