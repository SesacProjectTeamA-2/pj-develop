// Redis 세팅
const redis = require('redis');
// env
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../config/.env' });

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true, // v4버전은 promise 객체기반이므로, 옛날문법과의 호환성을 위해 설정.
  connect_timeout: 5000,
});
redisClient.connect().then();
const redis_Cli = redisClient.v4;

// subscriber 객체 생성
const subscriber = redisClient.duplicate();
subscriber.connect().then();
const sub = subscriber.v4;

const redisCli = { redis_Cli, sub };

redisClient.on('connect', async () => {
  console.info('Redis connected!');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);

  if (err.code === 'EAI_AGAIN') {
    redisClient.quit();
    setTimeout(() => {
      redisClient.connect();
    }, 3000);
  } else if (err.name === 'ConnectionTimeoutError') {
    redisClient.quit();
    setTimeout(() => {
      redisClient.connect();
    }, 3000);
  }
});

module.exports = redisCli;
