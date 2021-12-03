const router = require('koa-router')()
const multer = require('koa-multer')

const { MESSAGE } = require('../model/message')
const { sendSms } = require('../utils/message')

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
  ctx.body = JSON.stringify({
    data: Object.assign({}, ctx.req.file, {
      path: ctx.req.file.path
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

  let messageExpire = await MESSAGE.findOne({
    where: {
      phone: phone
    },
    order: [
      ['createdAt', 'DESC']
    ]
  },'DESC').then(res => {
    // 如果查无数据
    if (!res) {
      return true
    }

    const { status, createdAt } = res.dataValues
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
  messageExpire && await MESSAGE.create({
    phone: phone,
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