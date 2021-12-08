const router = require('koa-router')()
const multer = require('koa-multer')

const { Op } = require("sequelize");

const { getFile, putFile } = require('../utils/oss')
const { MESSAGE } = require('../model/message')
const { sendSms } = require('../utils/message')

const fs = require('fs');

router.prefix('/common')

/**
 * 通用上传
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
  let res = await putFile('image/' + ctx.req.file.filename, ctx.req.file.path)
  ctx.body = JSON.stringify({
    data: Object.assign({}, ctx.req.file, {
      path: res.url
    }),
    isSuccess: true,
    code: 200
  })
})

/**
 * @description 通用下载
 */
router.post('/download', async (ctx) => {
  const path = await getFile(ctx.request.body.path)
  
  const Size = fs.statSync(path).size;
  const createReadStream = await fs.createReadStream(path)
  ctx.set('Content-disposition', 'attachment; filename=' + path.split('/').pop())
  ctx.set('Content-type', 'application/force-download')
  ctx.set('Content-Length', Size)
  ctx.body = createReadStream

  // 删除本地文件
  fs.unlinkSync(path)
})

/**
 * @description 通用短信发送
 * @param phone 手机号
 */
router.get('/message', async (ctx) => {

  const { phone, type } = ctx.request.query

  let code = ''
  for(var i=0;i<6;i++){
    code += Math.floor(Math.random()*10)
　}

  // 获取当天时间
  const date = new Date()
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() 
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  let year = date.getFullYear()

  let messageExpire = await MESSAGE.findAll({
    where: {
      phone: phone,
      remote_addr: ctx.header['x-real-ip'],
      [Op.and]: [{
        createdAt: {
          [Op.between]: [new Date(`${year}-${month}-${day} 00:00:00`), new Date(`${year}-${month}-${day} 23:59:59`)]
        }
      }]
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
    if (res.length > 5) {
      ctx.body = JSON.stringify({
        data: '当日已超过最大发送数量',
        isSuccess: false,
        code: 200
      })
      return false
    }

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

  messageExpire && await MESSAGE.create({
    phone,
    remote_addr: ctx.header['x-real-ip'],
    code,
    type
  }).then(async () => {
    await sendSms(phone, code).then(res => {
      console.log(res)
      if (res.Message === 'OK') {
        ctx.body = JSON.stringify({
          data: '发送成功',
          isSuccess: true,
          code: 200
        })
      } else {
        ctx.body = JSON.stringify({
          data: res.Message,
          isSuccess: false,
          code: 200
        })
      }

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