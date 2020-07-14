const router = require('koa-router')()

router.prefix('/detail')

const { SERVICE_LIST } = require('../model/service')

/**
 * 查询详情
 */
router.get('/server', async function(ctx) {
  const { id } = ctx.request.query

  await SERVICE_LIST.findAndCountAll({
    where: {
      id
    }
  }).then(async function(res) {
    if (res.rows.length) {
      await SERVICE_LIST.update({
        viewCount: res.rows[0].viewCount + 1
      }, {
        where: {
          id
        }
      }).then(res => {
        
      })
      ctx.body = JSON.stringify({
        isSuccess: true,
        data: res.rows[0],
        code: 200
      })
      
    } else {
      ctx.body = JSON.stringify({
        isSuccess: true,
        data: '查无数据',
        code: 201
      })
    }
  })
})

module.exports = router