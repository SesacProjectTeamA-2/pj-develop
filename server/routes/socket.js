const IO = require('socket.io');
const authSocketUtil = require('../middlewares/authSocket');
const chatSocket = require('../controller/Cchat').chatSocket;

exports.setupSocket = async (server, options) => {
  try {
    const io = IO(server, options);
    const connectedUser = []; // 연결된 클라이언트를 저장할 객체

    // 네임스페이스 생성(모임챗) - 룸: 각 모임별 챗
    // Express의 라우팅처럼 url에 지정된 위치에 따라 신호의 처리를 다르게 하는 기술(특정 페이지에서 소켓이 보내주는 모든 실시간 메세지를 받을 필요는 없다)
    // Room은 namespace의 하위개념에 해당.(카톡 단톡방 1, 단톡방 2...)
    const userIO = io.of(`/api/socket`);

    // 토큰 검증 미들웨어 추가
    userIO.use(authSocketUtil.checkToken);

    // 네임스페이스에 이벤트 리스너 등록
    userIO.on('connection', async (socket) => {
      try {
        // 클라이언트 소켓의 고유한 ID를 가져옴
        const socketId = socket.id;
        const loginTime = socket.loginTime;
        console.log(
          `/api/socket 네임스페이스 연결 완료, 접속시간 ${socket.loginTime}::: `,
          socketId
        );

        // 네임스페이스 생성/참가(채팅)
        const groupChat = io.of(`/api/socket/chat`);

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
            console.log(connectedUser);
            socket.emit('loginSuccess', {
              msg: `${uName}님이 로그인하셨어요`,
              userInfo,
            });
          } catch (err) {
            console.error(err);
          }
        });

        // 모임별 채팅 컨트롤러
        groupChat.on('connect', () => {
          console.log('groupChat 네임스페이스 연결');
          chatSocket(groupChat, connectedUser);
        });

        // 각 모임방에 notice
        socket.on('logout', (data) => {
          try {
            const uSeq = data.uSeq;
            // 해당 소켓에 대한 정보를 connectedUser 배열에서 찾아 제거
            console.log('User logged out:', socketId);
            // connectedUser 배열에서 uSeq가 일치하는 객체 찾기
            const userIndex = connectedUser.findIndex(
              (user) => user.uSeq === uSeq
            );

            if (userIndex !== -1) {
              // 해당 객체를 배열에서 제거
              connectedUser.splice(userIndex, 1);
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
