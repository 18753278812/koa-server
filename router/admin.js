const router = require('koa-router')()
// const MongoDB = require('../model/mongo-user')
const redisClient = require('../config/redis').client

const { USER } = require('../model/admin')
const { SERVICE_LIST } = require('../model/service')

router.prefix('/admin')

// 管理员登录
router.post('/login', async function (ctx) {
  const { username, password } = ctx.request.body
  await USER.findAndCountAll({
    where: {
      username,
      password
    }
  }).then(async function (res) {
    if (res.count) {
      const { id, username, password } = res.rows[0]
      // 设置前端session
      ctx.session = {
        id,
        username
      }

      ctx.body = JSON.stringify({
        data: '登录成功',
        isSuccess: true,
        code: 200
      })
      // 设置登录session
      // await MongoDB.save({
      //   id,
      //   username
      //   // date: new Date()
      // }).then(res => {
      //   ctx.body = JSON.stringify({
      //     data: '登录成功',
      //     isSuccess: true,
      //     code: 200
      //   })
      // })
    } else {
      ctx.body = JSON.stringify({
        data: '账号或密码错误',
        isSuccess: false,
        code: 200
      })
    }
  })
})

// 管理员获取用户信息
router.get('/userInfo', async function (ctx) {
  const { id, username } = ctx.session
  await USER.findAndCountAll({
    where: {
      id,
      username
    }
  }).then(res => {
    const { id, username } = res.rows[0]
    ctx.body = JSON.stringify({
      data: {
        id,
        username
      },
      isSuccess: true,
      code: 200
    })
  })
})

/**
 * 新增服务
 */
router.post('/service/insert', async function(ctx) {
  const { name, imgSrc } = ctx.request.body
  await SERVICE_LIST.create({
    name,
    imgSrc,
    createdBy: ctx.session.username
  }).then(function (res) {
    ctx.body = JSON.stringify({
      isSuccess: true,
      data: res.dataValues,
      code: 200
    })
  })
})

module.exports = router