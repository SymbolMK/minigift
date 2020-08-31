const { resolve } = require('path')
const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const R = require('ramda')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

const r = (path) => resolve(__dirname, path)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 9527
const MIDDLEWARES = ['database', 'common', 'router']

class Server {
  constructor() {
    this.app = new Koa()
    this.useMiddleWares(this.app)(MIDDLEWARES)
  }

  useMiddleWares(app) {
    return R.map(
      R.compose(
        R.map((i) => i(app)),
        require,
        (i) => `${r('./middleware')}/${i}/index.js`
      )
    )
  }

  async start() {
    const nuxt = await new Nuxt(config)
    if (config.dev) {
      try {
        const builder = new Builder(nuxt)
        await builder.build()
      } catch (e) {
        consola.log(e)
        process.exit(1)
      }
    }
    this.app.use(async (ctx, next) => {
      await next()
      ctx.status = 200
      ctx.req.session = ctx.session

      return new Promise((resolve, reject) => {
        ctx.res.on('close', resolve)
        ctx.res.on('finish', resolve)
        nuxt.render(ctx.req, ctx.res, (promise) => {
          promise.then(resolve).catch(reject)
        })
      })
    })

    this.app.listen(port, host)
    consola.log(`Server listening on ${host}:${port}`)
  }
}

const app = new Server()

app.start()







// const Koa = require('koa')
// const Koa = require('koa')
// const consola = require('consola')
// const { Nuxt, Builder } = require('nuxt')

// const app = new Koa()
// const host = process.env.HOST || '127.0.0.1'
// const port = process.env.PORT || 3000

// // Import and Set Nuxt.js options
// let config = require('../nuxt.config.js')
// config.dev = !(app.env === 'production')

// async function start() {
//   // Instantiate nuxt.js
//   const nuxt = new Nuxt(config)

//   // Build in development
//   if (config.dev) {
//     const builder = new Builder(nuxt)
//     await builder.build()
//   }

//   app.use(ctx => {
//     ctx.status = 200 // koa defaults to 404 when it sees that status is unset

//     return new Promise((resolve, reject) => {
//       ctx.res.on('close', resolve)
//       ctx.res.on('finish', resolve)
//       nuxt.render(ctx.req, ctx.res, promise => {
//         // nuxt.render passes a rejected promise into callback on error.
//         promise.then(resolve).catch(reject)
//       })
//     })
//   })

//   app.listen(port, host)
//   consola.ready({
//     message: `Server listening on http://${host}:${port}`,
//     badge: true
//   })
// }

// start()
