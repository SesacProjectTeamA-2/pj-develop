const IO = require('socket.io');
const authSocketUtil = require('./middlewares/authSocket');
const chatSocket = require('./controller/Csocket').chatSocket;

exports.io = async (server, options) => {
  try {
    const io = IO(server, options);

    // 토큰 검증 미들웨어 추가
    io.use(authSocketUtil.checkToken);

    io.on('connect', (socket) => {
      console.log('io 통신 연결!');
      // 클라이언트 소켓의 고유한 ID를 가져옴
      const socketId = socket.id;

      const connectedUser = []; // 연결된 클라이언트를 저장할 객체

      // 현재 로그인 중인 유저 정보 추가
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

          connectedUser.push(userInfo);

          socket.emit('loginSuccess', {
            msg: `${uName}님이 로그인하셨어요`,
            userInfo,
          });
        } catch (err) {
          console.error(err);
        }
      });

      // 네임스페이스 생성/참가(채팅)
      const groupChat = io.of(`/api/socket/chat`);

      // 모임별 채팅 컨트롤러
      groupChat.on('connect', () => {
        chatSocket(groupChat, connectedUser);
      });

      // 각 모임방에 notice
      socket.on('logout', () => {
        try {
          // 해당 소켓에 대한 정보를 connectedUser 배열에서 찾아 제거
          console.log('User logged out:', socketId);
          const index = connectedUser.findIndex(
            (user) => user.socketId === socketId
          );
          if (index !== -1) {
            connectedUser.splice(index, 1);
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
    });
  } catch (err) {
    console.error('io 통신 error', err);
  }
};
