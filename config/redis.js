const { host, redisPsd } = require('./config.json')
// 初始话redis
const redisStore = require('koa-redis')({
  host: host,
  port: 6379,
  password: redisPsd
});

module.exports = redisStore