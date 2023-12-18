// Redis 세팅
const redis = require('redis');
// env
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../config/.env' });

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true, // v4버전은 promise 객체기반이므로, 옛날문법과의 호환성을 위해 설정.
});

redisClient.connect().then();
const redisCli = redisClient.v4;

redisClient.on('connect', () => {
  console.info('Redis connected!');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

module.exports = redisCli;
