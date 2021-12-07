const router = require('koa-router')()

const { Op } = require("sequelize");

const path = require('path')
const { SERVICE_LIST } = require('../model/service')

router.prefix('/index')

/**
 * 查询服务
 * @param { name, pageSize, pageNo } 服务名, 每页条数, 当前页
 * @return Array
 */
router.get('/getServiceList', async function (ctx, next) {
  const { name, pageSize = 10, pageNo = 1 } = ctx.request.query

  const offset = (pageNo - 1) * pageSize;

  await SERVICE_LIST.findAndCountAll({
    where: {
      name: {
        [Op.substring]: name || ''
      }
    },
    offset,
    limit: Number(pageSize)
  }).then(function(res) {
    
    ctx.body = JSON.stringify({
      data: res,
      isSuccess: true,
      code: 200
    })
  })
})

/**
 * 获取所有服务
 * @return Array
 */
 router.get('/getServiceListAll', async function (ctx, next) {
  // const { name, pageSize = 10, pageNo = 1 } = ctx.request.query

  // const offset = (pageNo - 1) * pageSize;

  await SERVICE_LIST.findAndCountAll({
    // where: {
    //   name: {
    //     [Op.substring]: name || ''
    //   }
    // },
    // offset,
    // limit: Number(pageSize)
  }).then(function(res) {
    
    ctx.body = JSON.stringify({
      data: res,
      isSuccess: true,
      code: 200
    })
  })
})

module.exports = router