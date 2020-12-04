const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const session = require('koa-session')
const path = require('path')
const MongoDB = require('./model/mongo-user')

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
    console.log(err)
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


app.listen(3334);