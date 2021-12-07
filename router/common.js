const router = require('koa-router')()
const multer = require('koa-multer')

const { Op } = require("sequelize");

const { put } = require('../utils/oss')
const { MESSAGE } = require('../model/message')
const { sendSms } = require('../utils/message')

const fs = require('fs');

router.prefix('/common')

/**
 * 通用上传
 * 
 */
const storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
const upload = multer({ storage: storage });
//路由
router.post('/upload', upload.single('file'), async (ctx) => {
  let res = await put('image/' + ctx.req.file.filename, ctx.req.file.path)
  ctx.body = JSON.stringify({
    data: Object.assign({}, ctx.req.file, {
      path: res.url
    }),
    isSuccess: true,
    code: 200
  })
})

/**
 * @description 通用短信发送
 * @param phone 手机号
 */
router.get('/message', async (ctx) => {

  const { phone } = ctx.request.query

  let code = ''
  for(var i=0;i<6;i++){
    code += Math.floor(Math.random()*10)
　}

  // // 获取当天时间
  // const date = new Date()


  let messageExpire = await MESSAGE.findAll({
    where: {
      phone: phone,
      remote_addr: ctx.header['x-real-ip'],
      // [Op.and]: [{
      //   createdAt: {
      //     [Op.between]: ['2021/12/07', '2021/12/07'],
          
      //   }
      // }]
    },
    order: [
      ['createdAt', 'DESC']
    ]
  },'DESC').then(res => {
    console.log(res.length)
    // 如果查无数据
    if (!res.length) {
      return true
    }

    // 查询当天条数

    const { status, createdAt } = res[0].dataValues
    // 判断验证码未被使用，且距上次发送以超过1分钟
    if (!status && new Date().getTime() - new Date(createdAt).getTime() >= 60 * 1000) {
      return true
    }

    if (status) {
      return true
    }

    ctx.body = JSON.stringify({
      data: '请1分钟后再试',
      isSuccess: false,
      code: 200
    })
  })
  false && messageExpire && await MESSAGE.create({
    phone: phone,
    remote_addr: ctx.header['x-real-ip'],
    code: code
  }).then(() => {
    sendSms(phone, code).then(res => {
      ctx.body = JSON.stringify({
        data: '发送成功',
        isSuccess: true,
        code: 200
      })
    }).catch(err => {
      ctx.body = JSON.stringify({
        data: err,
        isSuccess: false,
        code: 200
      })
    })
  })
})

module.exports = router