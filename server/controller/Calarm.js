const redisCli = require('../models/redis').redis_Cli;
const jwt = require('../modules/jwt');
// Redis subscribe 객체
const sub = require('../models/redis').sub;

exports.alarm = async (req, res) => {
  try {
    const sse = req.app.get('sse');

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

    // 기존 알람 load (connection)
    sse.on('connection', async (res) => {
      console.log('SSE 연결 완료!');

      const alarmCount = await redisCli.lLen(`user${uSeq}`);
      const data = await redisCli.lRange(`user${uSeq}`, 0, -1);
      const allAlarm = data.map((alarm) => JSON.parse(alarm));

      // 처음 연결시 보낼 알림목록 및 숫자
      res.write('event: connect\n' + JSON.stringify({ alarmCount, allAlarm }));

      // redis에 댓글추가시 메세지 전송됨.
      const newAlarm = await sub.subscribe('comment-alarm');
      console.log('newAlarm', newAlarm);

      // 모임 추방시 메세지 전송.
      const blackAlarm = await sub.subscribe('group-alarm');

      // SSE 데이터 전송
      if (newAlarm) {
        res.write('event: alarm\n' + `data:${newAlarm}\n\n`);
      }

      if (blackAlarm) {
        res.write('event: alarm\n' + `data:${blackAlarm}\n\n`);
      }
    });
  } catch (err) {
    console.error('SSE server error!!', err);
  }
};

exports.delAlarm = async (req, res) => {
  try {
    // 1. 알람 클릭시, redis에서 삭제
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
    const value = req.body.commentInfo;
    console.log('댓글 정보', value);
    const result = await redisCli.lRem(`user${uSeq}`, 0, JSON.stringify(value));
    console.log('redis 데이터 삭제 완료', result);

    // 해당 페이지 이동위한 gbSeq
    if (value.gbSeq) {
      res.send({ isSuccess: true, gbSeq: value.gbSeq });
    } else {
      res.send({
        isSuccess: true,
      });
    }

    // 2. 모두 읽음기능?
  } catch (err) {
    console.error('알람삭제 서버 error', err);
  }
};
