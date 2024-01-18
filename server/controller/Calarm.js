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

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*', // CORS 설정을 추가
      });
      res.write('\n');

      const alarmCount = await redisCli.lLen(`user${uSeq}`);
      const allAlarm = await redisCli.lRange(`user${uSeq}`, 0, -1);

      // 처음 연결시 보낼 알림목록 및 숫자

      // 기존 알람 load (connection)
      // sse.on('connection', async (client) => {
      res.write('event: connected\n' + `data: ${alarmCount}\n\n`);

      res.write('event: allAlarm\n' + `data: ${JSON.stringify(allAlarm)}\n\n`);

      // 댓글 작성시 메세지 전송
      await sub.subscribe('comment-alarm', (data) => {
        const datas = JSON.parse(data);

        console.log('>>>>>>>>>>>', datas);
        res.write(
          `event: commentAlarm${parseInt(datas.receiver)}\n` +
            `data:${JSON.stringify(datas.allAlarm)}\n\n`
        );
        res.write(
          `event: alarmCount${parseInt(datas.receiver)}\n` +
            `data: ${parseInt(datas.alarmCount)}\n\n`
        );
      });

      // 모임 추방시 메세지 전송

      await sub.subscribe(`group-alarm${uSeq}`, (data) => {
        try {
          console.log('message', message);

          const datas = JSON.parse(data);
          res.write(
            `event: groupAlarm${parseInt(datas.receiver)}\n` +
              `data:${JSON.stringify(datas.allAlarm)}\n\n`
          );
          res.write(
            `event: alarmCount${parseInt(datas.receiver)}\n` +
              `data: ${parseInt(datas.alarmCount)}\n\n`
          );
        } catch (err) {
          console.error('group alarm error', err);
        }
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

    const value = req.body;

    const result = await redisCli.lRem(`user${uSeq}`, 0, JSON.stringify(value));
    console.log('redis 데이터 삭제 완료', result);

    const allAlarm = await redisCli.lRange(`user${uSeq}`, 0, -1);
    console.log(allAlarm);
    const alarmArray = allAlarm.map((item) => JSON.parse(item));

    console.log(alarmArray);

    // 해당 페이지 이동위한 gbSeq
    if (value.gbSeq) {
      return res.send({
        isSuccess: true,
        gbSeq: value.gbSeq,
        alarmList: alarmArray,
      });
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
