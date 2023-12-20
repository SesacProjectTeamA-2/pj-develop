const redisCli = require('../models/redis').redis_Cli;
const jwt = require('../modules/jwt');
// Redis subscribe 객체
const sub = require('../models/redis').sub;

exports.alarm = async (req, res) => {
  try {
    const sse = req.get('sse');

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
    sse.on('connection', async (req, res) => {
      console.log('SSE 연결 완료!');

      const alarmCount = await redisCli.lLen(`user${uSeq}`);
      const data = await redisCli.lRange(`user${uSeq}`, 0, -1);
      const allAlarm = data.map((alarm) => JSON.parse(alarm));

      res.write({ alarmCount, allAlarm });
    });

    // 서버로부터 데이터가 오면(messaging) - 10초마다 데이터를 체크하되, 이벤트가 발생할때만 응답전송
    sse.on('messaging', async (req, res) => {
      // 1. redis
      const newAlarm = await sub.subscribe('comment_alarm');
      console.log('newAlarm', newAlarm);

      // SSE 데이터 전송
      setInterval(() => {
        const data = `data: ${new Date()}\n\n`;
        res.write('event: alarm\n' + 'data: ' + newAlarm + '\n\n');
      }, 10000);

      sse.on('disconnect', () => {
        console.log('SSE 연결 해제!');
      });
    });
  } catch (err) {}
};
