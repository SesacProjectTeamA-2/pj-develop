const redis = require('redis');
// env
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/config/.env' });

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true, // v4버전은 promise 객체기반이므로, 옛날문법과의 호환성을 위해 설정.
  connect_timeout: 5000,
});

redisClient.connect().then(); // connect to redis v4 (async)

const redisCli = redisClient.v4;
redisClient.on('connect', async () => {
  console.log('Redis에 연결되었습니다');

  // redisClient.set('test', '123');
  // let data = await redisCli.get('test');
  // console.log(data);
  // const result = await redisCli.lPush('testRoom', '1');
  // console.log(result);
  const result = await redisCli.lRange('room1', 0, -1);
  console.log(result);
  // 레디스 모든 데이터 삭제
  await redisCli.flushAll();
  // console.log(result);

  redisClient.on('error', (err) => {
    console.error('redis client error!', err);
  });
});

// 방별 메세지개수(gSeq, 개수) 100
// 방입장시 초기화 및 해당 메세지 개수 저장() 100
// 현재 방의 메세지 개수 전송(gSeq, 개수) 120
// 방나갔을때(sendMsg : 메세지 개수 증가) : 방별 메세지 개수 - 해당메세지개수
// 150개 - 120개때 들어감(count)
// - 20개를 읽고 나왔어(sendmsg시 ++), 10개가 남아, 다시들어가

// 150 - 120 -20 10
