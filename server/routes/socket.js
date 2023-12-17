// const chatSocket = require('../controller/Cchat').chatSocket;
// const io = req.app.get('io'); // 전역변수로 등록해논 io객체를 가져옴
// 미들웨어 설정
const authSocketUtil = require("../middlewares/authSocket.js");
const redisCli = require("../models/redis");

exports.chatSocket = async (io, socket) => {
  try {
    // 네임스페이스 생성(모임챗) - 룸: 각 모임별 챗
    // Express의 라우팅처럼 url에 지정된 위치에 따라 신호의 처리를 다르게 하는 기술(특정 페이지에서 소켓이 보내주는 모든 실시간 메세지를 받을 필요는 없다)
    // Room은 namespace의 하위개념에 해당.(카톡 단톡방 1, 단톡방 2...)
    const groupChat = io.of(`/api/chat`);
    groupChat.use(authSocketUtil.checkToken);

    // 네임스페이스에 이벤트 리스너 등록
    groupChat.on("connection", async (socket) => {
      try {
        const connectedUser = socket.connectedUser;
        const userInfo = socket.userInfo;

        const { uName, uSeq, loginTime, socketId } = userInfo;

        console.log("현재 접속중인 유저", connectedUser);

        console.log(
          `/api/chat 네임스페이스 연결 완료, 접속시간 ${loginTime}::: `,
          socketId,
        );

        // 로그인시 각 방에 참여
        socket.on("login", (data) => {
          try {
            userInfo.gSeq = data.gSeq;
            console.log(userInfo);
            if (Array.isArray(data.gSeq)) {
              data.gSeq.map((info) => {
                const isExisting = groupChat.adapter.rooms.has(`room${info}`);
                console.log(`room${info} 현재 생성되어 있음?`, isExisting);

                // 방에 참가 및 notice
                socket.join(`room${info}`);

                groupChat.to(`room${info}`).emit("loginNotice", {
                  msg: `${uName}님이 로그인하셨어요`,
                });
              });
            } else {
              console.log(`gSeq is not Array!`);
              return;
            }

            socket.emit("loginSuccess", {
              msg: `${uName}님이 로그인하셨어요`,
              userInfo,
            });
          } catch (err) {
            console.error(err);
          }
        });

        // 모임별 채팅방 입장시
        socket.on("joinRoom", async (data) => {
          try {
            const gSeq = data.gSeq;

            console.log("::::", groupChat.adapter.rooms);

            // 룸에 접속중인 소켓 로드 (접속중인 소켓 없을 때는 빈 배열 반환)
            const socketsInRoom = Array.from(
              groupChat.adapter.rooms.get(`room${gSeq}`) || [],
            );
            const arrayInRoom = connectedUser.filter((user) =>
              socketsInRoom.includes(user.socketId),
            );
            const uNameInRoom = arrayInRoom.map((user) => user.uName);

            console.log(`room${gSeq}에 접속된 아이디 목록`, uNameInRoom);

            // LLEN을 사용하여 리스트의 길이(메시지 개수)를 가져옴
            const listLength = await redisCli.lLen(`room${gSeq}`);

            if (listLength !== 0) {
              // 사용자가 접속한 이후의 메시지만을 가져옴
              const messages = await redisCli.lRange(`room${gSeq}`, 0, -1);
              // 가져온 메시지를 파싱
              const parsedMessages = messages
                .map((message) => JSON.parse(message))
                .filter(
                  (parsedMessage) => parsedMessage.timeStamp >= loginTime,
                );

              socket.emit("joinRoom", {
                allMsg: parsedMessages,
                loginUser: uNameInRoom,
              });
            } else {
              //room data가 없는경우
              socket.emit("joinRoom", {
                allMsg: "모임방 메세지 없음!",
                loginUser: uNameInRoom,
              });
            }
          } catch (err) {
            console.log("joinRoomError", err);
          }
        });

        socket.on("sendMsg", async (data) => {
          try {
            // 자료구조 : lists (데이터를 순서대로 저장)
            // 추가 / 삭제 / 조회하는 것은 O(1)의 속도
            // 닉네임(socketId)/시간/룸/
            const { uSeq, timeStamp, msg, gSeq, socketId } = data;
            const roomChat = groupChat.to(`room${gSeq}`);

            // 메세지 정보 redis에 저장
            await redisCli.lPush(
              `room${gSeq}`,
              JSON.stringify({ msg, timeStamp, uSeq }),
            );

            roomChat.emit("msg", { uName, socketId, timeStamp, msg });

            console.log("msg 전송 성공 !!!! ", data);
          } catch (err) {
            console.error("sendMsg error", err);
          }
        });

        // 각 모임방에 notice
        socket.on("logout", (data) => {
          try {
            // 해당 소켓에 대한 정보를 connectedUser 배열에서 찾아 제거
            console.log("User logged out:", socketId);
            // connectedUser 배열에서 uSeq가 일치하는 객체 찾기
            const userIndex = connectedUser.findIndex(
              (user) => user.uSeq === uSeq,
            );

            if (userIndex !== -1) {
              // 해당 객체를 배열에서 제거
              connectedUser.splice(userIndex, 1);
            }
            socket.disconnect();
            console.log("남은 유저", connectedUser);
          } catch (err) {
            console.log("logout err", err);
          }
        });

        // 연결이 끊어질 때 연결된 소켓 목록에서 제거
        socket.on("disconnect", () => {
          console.log(`Socket ${socketId} disconnected.`);
          console.log("현재 접속되어 있는 유저", connectedUser);
          // 각 모임방에 notice
        });
      } catch (err) {
        console.error("io 통신 error", err);
      }
    });
  } catch (err) {
    console.log("socket 통신 error", err);
  }
};
