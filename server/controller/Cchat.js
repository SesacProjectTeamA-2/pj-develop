const redisCli = require('../models/redis').redis_Cli;

// 로그인 된 사용자인지 아닌지 판별하려면 불러와야함
const jwt = require('../modules/jwt');

// 내림차순 정렬 위한 함수
function personRoom(uSeq, targetSeq) {
  const a = Math.min(uSeq, targetSeq);
  const b = Math.max(uSeq, targetSeq);

  return `room${a}w${b}`;
}

exports.roomList = async (req, res) => {
  // 모임별 채팅에 대한 정보
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const user = await jwt.verify(token);
      const uSeq = user.uSeq;
      const gSeq = user.gSeq;
      const roomInfoArray = [];
      const dmInfoArray = [];

      // 1. 모임의 마지막 메세지 정보 송출
      if (Array.isArray(gSeq)) {
        // 아래와같이 사용할 경우, map이 끝날때까지 기다리지 않음 => map에 대한 동작을 변수로 할당해 promise.all() 사용해야한다.
        // userInfo.gSeq.map(async (info) => {
        //   const message = await redisCli.lRange(`room${info}`, -1, -1);
        //   socket.emit('roomInfo', JSON.parse(message));});
        for (const info of gSeq) {
          const listLength = await redisCli.lLen(`room${info}`);
          if (listLength !== 0) {
            const message = await redisCli.lIndex(`room${info}`, 0);
            const roomInfo = {
              gSeq: info,
              msg: JSON.parse(message),
            };
            roomInfoArray.push(roomInfo);

            console.log('roomInfoArray>>>', roomInfoArray);
          } else {
            console.log(`room${info}에 메세지 없음!`);
          }
        }
      }

      // 1대1 참가방 추출하고 각 방 참가시킴.
      const targetSeqArray = await redisCli.sMembers(`chatUser${uSeq}`);

      if (Array.isArray(targetSeqArray)) {
        for (const targetSeq of targetSeqArray) {
          const message = await redisCli.hGet(
            `chatUser${uSeq}`,
            `msg${targetSeq}`
          );
          const count = await redisCli.hGet(
            `chatUser${uSeq}`,
            `count${targetSeq}`
          );
          const roomInfo = {
            targetSeq,
            count,
            msg: JSON.parse(message),
          };
          dmInfoArray.push(roomInfo);
        }
      }

      res.send({ isSuccess: true, roomInfoArray, dmInfoArray });
    } else {
      res.send({ isSuccess: false, msg: 'token error' });
    }
  } catch (err) {
    console.error('roomInfo 에러', err);
  }
};
