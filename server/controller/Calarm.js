const redisCli = require('../models/redis');
const jwt = require('../modules/jwt');

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
    sse.on('connection', async () => {
      console.log('SSE 연결 완료!');

      // 1. redis
      const alarmCount = await redisCli.lLen(`user${uSeq}`);
      const data = await redisCli.lRange(`user${uSeq}`, 0, -1);
      const allAlarm = data.map((alarm) => JSON.parse(alarm));

      //   const
      // 2. mysql
    });

    // 서버로부터 데이터가 오면(messaging)
    sse.on('messaging', () => {
      // 1. redis
      //

      // SSE 데이터 전송
      setInterval(() => {
        const data = `data: ${new Date()}\n\n`;
        res.write(data);
      }, 10000);

      sse.on('disconnect', () => {
        console.log('SSE 연결 해제!');
      });
    });
  } catch (err) {}
};
