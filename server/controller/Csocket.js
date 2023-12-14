const IO = require('socket.io');
const redisCli = require('../models/redis');
const authSocketUtil = require('../middlewares/authSocket');
const redisAdapter = require('socket.io-redis');

exports.setupSocket = async (server, options) => {
  try {
    const io = IO(server, options);
    const connectedUser = []; // 연결된 클라이언트를 저장할 객체

    // Set 객체생성 : 중복된 값을 허용하지 않는 데이터 구조.
    // const connectedSockets = new Set();

    // 네임스페이스 생성(모임챗) - 룸: 각 모임별 챗
    // Express의 라우팅처럼 url에 지정된 위치에 따라 신호의 처리를 다르게 하는 기술(특정 페이지에서 소켓이 보내주는 모든 실시간 메세지를 받을 필요는 없다)
    // Room은 namespace의 하위개념에 해당.(카톡 단톡방 1, 단톡방 2...)
    const groupChat = io.of(`/api/chat`);

    // 토큰 검증 미들웨어 추가
    groupChat.use(authSocketUtil.checkToken);
    const printConnectedSocketIds = () => {
      const connectedSocketIds = Object.keys(groupChat.sockets);
      console.log('Connected socket IDs in the namespace:', connectedSocketIds);
    };

    // 네임스페이스에 이벤트 리스너 등록
    groupChat.on('connection', async (socket) => {
      try {
        // 클라이언트 소켓의 고유한 ID를 가져옴
        const socketId = socket.id;
        // console.log(socket);
        console.log(
          `/api/socket/chat 네임스페이스 연결 완료, 접속시간 ${socket.loginTime}::: `,
          socketId
        );
        const loginTime = socket.loginTime;
        groupChat.emit('success', '연결 성공!');

        // 로그인시
        socket.on('login', (data) => {
          try {
            const uSeq = data.uSeq;
            const uName = data.uName;
            const userInfo = {
              socketId: socketId,
              uSeq: uSeq,
              uName: uName,
              loginTime,
              gSeq: data.gSeq,
            };
            // 현재 로그인 중인 유저 정보 추가
            connectedUser.push(userInfo);

            if (Array.isArray(data.gSeq)) {
              data.gSeq.map((info) => {
                const isExisting = groupChat.adapter.rooms.has(`room${info}`);
                console.log(`room${info} 현재 생성되어 있음?`, isExisting);

                // 방에 참가 및 notice
                socket.join(`room${info}`);
                groupChat
                  .to(`room${info}`)
                  .emit('loginNotice', { msg: `${uName}님이 로그인하셨어요` });
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

        // 모임별 채팅방 입장시
        socket.on('joinRoom', async (data) => {
          try {
            // 룸에 접속중인 소켓 로드
            const result = groupChat.sockets.in(`room${gSeq}`);
            const socketsInRoom = Array.from(result);
            const arrayInRoom = connectedUser.filter((user) =>
              socketsInRoom.includes(user.socketId)
            );
            const uNameInRoom = arrayInRoom.map((user) => user.uName);

            console.log(`room${gSeq}에 접속된 아이디 목록`, uNameInRoom);

            // 접속한 이후의 모든 메세지 로드
            const gSeq = data.gSeq;
            const roomChat = groupChat.to(`room${gSeq}`);

            // LLEN을 사용하여 리스트의 길이(메시지 개수)를 가져옴
            const listLength = await redisCli.lLEN(`room${gSeq}`);
            if (listLength !== 0) {
              // 사용자가 접속한 이후의 메시지만을 가져옴
              const messages = await redisCli.lRange(`room${gSeq}`, 0, -1);
              // 가져온 메시지를 파싱
              const parsedMessages = messages.map((message) =>
                JSON.parse(message).filter(
                  (message) => message.timeStamp >= loginTime
                )
              );
            } else {
              //room data가 없는경우
              console.log(`room 내의 메세지가 없음!`);
            }

            socket.emit('joinRoom', {
              allMsg: parsedMessages,
              loginUser: uNameInRoom,
            });
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

            // 메세지 정보 redis에 저장
            await redisCli.lPush(
              `room${gSeq}`,
              JSON.stringify({ msg, timeStamp, uSeq })
            );

            roomChat.emit('msg', { uName, socketId, timeStamp, msg });
          } catch (err) {
            console.error('sendMsg error', err);
          }
        });

        // 각 모임방에 notice
        socket.on('logout', () => {
          try {
            // 해당 소켓에 대한 정보를 connectedUser 배열에서 찾아 제거
            const index = connectedUser.findIndex(
              (user) => user.socketId === socketId
            );
            if (index !== -1) {
              connectedUser.splice(index, 1);
              console.log('User logged out:', socketId);
            }
            socket.disconnect();
          } catch (err) {
            console.log('logout err', err);
          }
        });

        // 연결이 끊어질 때 연결된 소켓 목록에서 제거
        socket.on('disconnect', () => {
          console.log(`Socket ${socketId} disconnected.`);
          console.log('현재 접속되어 있는 유저', connectedUser);
        });
      } catch (err) {
        console.error('nameSpace error', err);
      }
    });
  } catch (err) {
    console.log('소켓 통신 err', err);
  }
};

// //   // 클라이언트에서 로그인 이벤트를 보내면, 연결을 저장하고 해당 연결을 사용
// //   if (!connectedUser[uSeq]) {
// //     connectedUser[uSeq] = socket.id;
// //     socket.name = uName;
// //     socket.roomName = gName;
// //     socket.roomNumber = gSeq;
// //     // 소켓에 들어오게 되면 자동으로 모임 채팅에 참여함
// //     socket.join(socket.roomNumber);
// //     console.log(socket.roomName, ' -- ', socket.roomNumber);
// //     console.log('연결된 유저 목록 ::::::', connectedUser);
// //   } else {
// //     // 이미 연결이 있는 경우, 기존 연결을 사용하고 새 연결을 닫음
// //     socket.disconnect();
// //   }
// // });
// // socket.on('chatMessage', (message) => {
// //   console.log(message);
// //   req.io
// //     .to(socket.roomNumber)
// //     .emit('message', `${socket.name} : ` + message); // 모든 클라이언트에 메시지를 전송
// // });
// // });
