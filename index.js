const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const session = require('koa-session')
const path = require('path')
const MongoDB = require('./model/mongo-user')

// 文件读写模块
const fs = require('fs')

// 通用工具方法
const { parseTime } = require('./utils/index')

// 静态资源
const upload_file = koaStatic(path.resolve(__dirname), './upload')

const admin = require('./router/admin')
const index = require('./router/index')
const common = require('./router/common')

// session配置
const config = {
  key: 'koa:sess',   //cookie key (default is koa:sess)
  maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true,  //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true,   //签名默认true
  rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false,  //(boolean) renew session when session is nearly expired,
}
app.keys = ['zch_secret'];

app.use(session(config, app))

app.use(async (ctx, next) => {
  try {
    // 排除上传响应格式
    if (ctx.url && ctx.url.split('/')[1] !== 'upload') {
      ctx.set('Content-Type', 'application/json')
    }

    const AUTH = ['admin'] // 需要进行鉴权的路由
    const AUTH_NOT = ['login'] // 从鉴权路由排除

    // 路由拦截
    if (AUTH.includes(ctx.path.split('/')[1]) && !AUTH_NOT.includes(ctx.path.split('/')[2])){
      const { id } = ctx.session
      // 校验session是否有效
      await MongoDB.query({
        id
      }).then(async res => {
        if (!res.length) {
          ctx.body = JSON.stringify({
            data: '用户信息已失效',
            isSuccess: false,
            code: 401
          })
        } else { // 如果用户信息存在
          await next()
        }
      })
    } else {
      await next()
    }

    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  } catch(err) {
    setLog(err)
    // 全局异常
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = JSON.stringify({
      isSuccess: false,
      data: err.message,
      code: 500
    })
  }
})

app.on('error', async (err) => {
  console.log(err)
})

// 要放在router注册之前
app.use(bodyParser())

// app.use(admin.routes(),admin.allowedMethods())
app.use(admin.routes())
app.use(index.routes())
app.use(common.routes())

// 静态文件服务
app.use(upload_file)


app.listen(3334)

function setLog(req) {
  let time = new Date()
  // 当天0点的时间戳
  let current = parseTime(time.toLocaleDateString())
  let content = ''

  fs.stat('logs',function(error){
    if (error) {
      console.log(error)
    }
    fs.mkdir('logs',function(error){
      if(error) {
        console.log(error)
      }

      console.log(current)
      
      // 若文件不存在，就创建一个吧！
      fs.existsSync('logs/' + current + '.log', function(exists) {
        if(!exists) {
          fs.writeFile('logs/' + current + '.log','', function(err) {
            if(err) {
              return console.log(err);
            }
          })
        }
      })

      // 增量更新日志文件，先读取
      fs.readFile('logs/' + current + '.log','utf8',(err, data) => {
        if (err) {
          console.log(err)
        }

        console.log(req)
        data += '\r\n'
        data += '报错内容:\r\n' + req + '\r\n'
        // data += '所在钩子: ' + req.body.hook + '\r\n'
        data += '报错时间: ' + time.toLocaleString() + '\r\n'
        // data += '报错页面: ' + req.body.url + '\r\n'
        // data += '用户信息:' + JSON.stringify(req.session.getErr.userInfo) + '\r\n';
        content = data
        // 记录错误内容
        fs.writeFile(
          'logs/' + current + '.log',
          content,
          (err) => {
            if (err) {
              console.log(err)
            }
        })
      })
    })
  })
}