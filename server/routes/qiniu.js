import * as qiniu from '../libs/index'
import { controller, get, del } from '../decorator/router'

@controller('/qiniu')
export class QiniuController {
  @get('/token')
  async token(ctx, next) {
    const key = ctx.query.key
    const token = qiniu.uptoken(key)
    return (ctx.body = {
      success: true,
      code: 200,
      data: {
        key,
        token
      }
    })
  }

  @del('delete')
  async delete(ctx, next) {
    const key = ctx.query.key
    const res = await qiniu.deleteFile(key)
    if (res.success) {
      ctx.body = {
        success: true,
        code: 200,
        data: res
      }
    } else {
      ctx.body = {
        success: false,
        code: 500,
        data: res
      }
    }
  }
}
