// const chatSocket = require('../controller/Cchat').chatSocket;
// const io = req.app.get('io'); // 전역변수로 등록해논 io객체를 가져옴
// 미들웨어 설정
const authSocketUtil = require('../middlewares/authSocket.js');

const redisCli = require('../models/redis');

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
        const connectedUser = socket.connectedUser;
        const userInfo = socket.userInfo;

        const { uName, uSeq, loginTime, socketId } = userInfo;

        console.log('현재 접속중인 유저', connectedUser);

        console.log(
          `/api/chat 네임스페이스 연결 완료, 접속시간 ${loginTime}::: `,
          socketId
        );

        // 로그인시 각 방에 참여
        socket.on('login', (data) => {
          try {
            userInfo.gSeq = data.gSeq;
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

        // 각 모임방에 notice
        socket.on('logout', (data) => {
          try {
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
