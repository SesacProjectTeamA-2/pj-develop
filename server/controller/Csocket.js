const IO = require('socket.io');
const jwt = require('../modules/jwt');
const redisCli = require('../models/redis');

const redisAdapter = require('socket.io-redis');

exports.setupSocket = async (server, options, req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1];
    const user = await jwt.verify(token);
    const uSeq = user.uSeq;
    const uName = user.uName;
    if (!token) {
      res.send({
        success: false,
        msg: '토큰 X',
      });
    }
    if (!uSeq) {
      res.send({
        success: false,
        msg: '로그인X or 비정상적인 접근',
      });
      return;
    }

    const io = IO(server, options);
    const connectedUser = {}; // 연결된 클라이언트를 저장할 객체

    // Set 객체생성 : 중복된 값을 허용하지 않는 데이터 구조.
    const connectedSockets = new Set();

    // 네임스페이스 생성(모임챗) - 룸: 각 모임별 챗
    // Express의 라우팅처럼 url에 지정된 위치에 따라 신호의 처리를 다르게 하는 기술(특정 페이지에서 소켓이 보내주는 모든 실시간 메세지를 받을 필요는 없다)
    // Room은 namespace의 하위개념에 해당.(카톡 단톡방 1, 단톡방 2...)
    const groupChat = io.of(`/api/chat`);

    const test1 = redisCli.get('test1');
    console.log(test1);

    const printConnectedSocketIds = () => {
      const connectedSocketIds = Object.keys(groupChat.sockets);
      console.log('Connected socket IDs in the namespace:', connectedSocketIds);
    };

    // 네임스페이스에 이벤트 리스너 등록
    groupChat.on('connection', async (socket) => {
      try {
        // printConnectedSocketIds();

        // 클라이언트 소켓의 고유한 ID를 가져옴
        const socketId = socket.id;
        // console.log(socket);
        console.log(`/api/socket/chat 네임스페이스 연결 완료 ::: `, socketId);

        // 이미 연결된 소켓인지 확인
        if (connectedSockets.has(socketId)) {
          // 중복 연결이면 처리하지 않고 종료
          console.log(`Socket ${socketId} is already connected.`);
          return;
        }

        // 1. 로그인메세지 전달
        // 2. 모임별 채팅방에 입장 및 notice (생성된 룸없을 경우 직접 생성)
        socket.on('login', (data) => {
          try {
            if (Array.isArray(data)) {
              data.gSeq.map((info) => {
                const isExisting = groupChat.adapter.rooms.has(
                  `room${info.gSeq}`
                );
                if (isExisting) {
                  socket.join(`room${info}`);
                  groupChat
                    .to(`room${info}`)
                    .emit('success', { msg: `${uName}님이 로그인하셨어요` });
                } else {
                  groupChat.adapter.socketsJoin(socketId, `room${info.gSeq}`);
                }
              });
            }

            const loginTime = new Date();

            // 현재 연결 중인 유저 추가 : socketId의 키값을 가진 객체로 저장.
            connectedUser[socketId] = { socketId, uSeq, uName, loginTime };

            socket.emit('loginSuccess', { msg: `${uName}님이 로그인하셨어요` });
          } catch (err) {
            console.error(err);
          }
        });

        socket.on('joinRoom', async (data) => {
          try {
            // 접속한 이후의 모든 메세지 로드
            const gSeq = data.gSeq;
            const roomChat = groupChat.to(`room${gSeq}`);

            // 룸에 해당하는 메세지 가져오기
            await redisCli.hgetall(`room${gSeq}`);

            const newMessages = Object.entries(messages)
              .filter(([timestamp]) => parseInt(timestamp) > loginTime)
              .map(([timestamp, message]) => ({
                timestamp: parseInt(timestamp),
                message,
              }));

            newMessages.sort((a, b) => a.timestamp - b.timestamp);

            roomChat.emit('allMessages', { messages: newMessages });
          } catch (err) {
            console.log('joinRoomError', err);
          }
        });

        socket.on('sendMsg', async (data) => {
          try {
            // 닉네임(socketId)/시간/룸/
            const { socketId, uName, timeStamp, msg, gSeq } = data;
          } catch (err) {
            console.error(err);
          }
        });

        socket.on('logout', () => {
          console.log('logout');
          socket.disconnect();
        });

        // 연결이 끊어질 때 연결된 소켓 목록에서 제거
        // 각 모임방에 notice
        socket.on('disconnect', () => {
          console.log(`Socket ${socketId} disconnected.`);
          groupChat.emit(
            'notice'
            // `${connectedUser[socketId].uName}님이 로그아웃하셨습니다.`
          );
          delete connectedUser[socketId];
          connectedSockets.delete(socketId);
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
