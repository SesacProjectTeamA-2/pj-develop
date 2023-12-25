const redisCli = require('../models/redis').redis_Cli;
const jwt = require('../modules/jwt');
// Redis subscribe 객체
const sub = require('../models/redis').sub;

exports.alarming = async (req, res) => {
  try {
    // const sse = req.app.get('sse');
    // console.log(sse.server);
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const user = await jwt.verify(token);
      const uSeq = user.uSeq;

      if (!uSeq) {
        res.send({
          success: false,
          msg: '로그인X or 비정상적인 접근',
        });
        return;
      }

      const alarmCount = await redisCli.lLen(`user${uSeq}`);
      const allAlarm = await redisCli.lRange(`user${uSeq}`, 0, -1);

      console.log(allAlarm);
      // 처음 연결시 보낼 알림목록 및 숫자
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*', // CORS 설정을 추가
      });

      // 기존 알람 load (connection)
      // sse.on('connection', async (client) => {
      res.write('event: connected\n' + `data: SSE연결완료\n\n`);
      res.write('event: alarmCount\n' + `data: ${alarmCount}`);
      res.write('event: alarmList\n' + `data: ${allAlarm}`);

      // redis에 댓글추가시 메세지 전송 + count 1.
      await sub.subscribe('comment-alarm', (message) => {
        res.write('event: commentAlarm\n' + `data:${message}\n\n`);
        res.write(
          'event: alarmCount\n' + `data: ${parseInt(alarmCount) + 1}\n\n`
        );
      });

      // 모임 추방시 메세지 전송 + count 1.
      await sub.subscribe('group-alarm', (message) => {
        res.write('event: groupAlarm\n' + `data:${message}\n\n`);
        res.write(
          'event: alarmCount\n' + `data: ${parseInt(alarmCount) + 1}\n\n`
        );
      });
      // });
    } else {
      console.log('토큰이 없음!');
    }
  } catch (err) {
    console.error('SSE 서버 연결 err', err);
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
      return res.send({ isSuccess: true, gbSeq: value.gbSeq });
    } else {
      return res.send({
        isSuccess: true,
      });
    }

    // 2. 모두 읽음기능?
  } catch (err) {
    console.error('알람삭제 서버 error', err);
  }
};
