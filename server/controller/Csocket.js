const redisCli = require('../models/redis');

exports.chatSocket = async (groupChat, connectedUser) => {
  try {
    groupChat.on('login', (data) => {
      const uName = data.uName;
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
    });

    // 모임별 채팅방 입장시
    socket.on('joinRoom', async (data) => {
      try {
        const gSeq = data.gSeq;

        // 룸에 접속중인 소켓 로드 (접속중인 소켓 없을 때는 빈 배열 반환)
        const socketsInRoom = Array.from(
          groupChat.adapter.rooms.get(`room${gSeq}`) || []
        );
        const arrayInRoom = connectedUser.filter((user) =>
          socketsInRoom.includes(user.socketId)
        );
        const uNameInRoom = arrayInRoom.map((user) => user.uName);

        console.log(`room${gSeq}에 접속된 아이디 목록`, uNameInRoom);

        // LLEN을 사용하여 리스트의 길이(메시지 개수)를 가져옴
        const listLength = await redisCli.lLEN(`room${gSeq}`);

        if (listLength !== 0) {
          // 사용자가 접속한 이후의 메시지만을 가져옴
          const messages = await redisCli.lRange(`room${gSeq}`, 0, -1);
          // 가져온 메시지를 파싱
          const parsedMessages = messages
            .map((message) => JSON.parse(message))
            .filter((parsedMessage) => parsedMessage.timeStamp >= loginTime);

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
  } catch (err) {
    console.log('소켓 통신 err', err);
  }
};
