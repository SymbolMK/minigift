/**
 * 请求路由装饰器
 * author 马凯
 */

import { resolve } from 'path'
import Router from 'koa-router'
import glob from 'glob'
import R from 'ramda'

export const routersMap = new Map()
export const symbolPrefix = Symbol('minigift')
export const isArray = (v) => (Array.isArray(v) ? v : [v])
export const normallizePath = (path) =>
  path.startsWith('/') ? path : `/${path}`

export default class Route {
  constructor(app, apipath) {
    this.app = app
    this.router = new Router()
    this.apiPath = apipath
  }

  init() {
    glob.sync(resolve(this.apiPath, './*.js')).forEach(require)

    for (const [conf, controller] of routersMap) {
      const controllers = isArray(controller)
      let prefixPath = conf.target[symbolPrefix]
      if (prefixPath) prefixPath = normallizePath(prefixPath)

      const routerPath = prefixPath + conf.path

      this.router[conf.method](routerPath, ...controllers)
    }
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}
// 路由方法的基础注册
const router = (conf) => (target, key, desc) => {
  conf.path = normallizePath(conf.path)
  routersMap.set(
    {
      target,
      ...conf
    },
    target[key]
  )
}

export const controller = (path) => (target) =>
  (target.prototype[symbolPrefix] = path)

export const get = (path) =>
  router({
    method: 'get',
    path
  })

export const post = (path) =>
  router({
    method: 'post',
    path
  })

export const put = (path) =>
  router({
    method: 'put',
    path
  })

export const del = (path) =>
  router({
    method: 'del',
    path
  })

const decorate = (args, middleware) => {
  const [target, key, descriptor] = args

  target[key] = isArray(target[key])
  target[key].unshift(middleware)

  return descriptor
}

export const convert = (middleware) => (...args) => decorate(args, middleware)

export const required = (rules) =>
  convert(async (ctx, next) => {
    let errors = []

    const passRules = R.forEachObjIndexed((value, key) => {
      errors = R.filter((i) => !R.has(i, ctx.request[key]))(value)
    })

    passRules(rules)

    if (errors.length) ctx.throw(412, `${errors.join(', ')} 参数缺失`)

    await next()
  })
