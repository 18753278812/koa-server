const router = require('koa-router')()
const multer = require('koa-multer')

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

module.exports = router