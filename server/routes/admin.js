import api from '../api'
import { controller, get, post, required } from '../decorator/router'

@controller('/admin')
export class adminController {
  @post('login')
  @required({body: ['username', 'password']})
  async login (ctx, next) {
    const { username, password } = ctx.request.body
    const data = await api.admin.login(username, password)
    const { user, match } = data

    if (match) {
      if (user.role !== 'admin') {
        return (ctx.body = {
          success: false,
          code: 401,
          err: '来错地方了'
        })
      }

      ctx.session.user = {
        _id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        avatar: user.avatar
      }

      return (ctx.body = {
        success: true,
        code: 200,
        data: {
          username: user.username,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      })
    }

    return (ctx.body = {
      success: false,
      code: 401,
      err: '密码错误'
    })
  }

  @post('logout')
  async logout (ctx, next) {
    ctx.session = null

    ctx.body = {
      code: 200,
      success: true
    }
  }
  
}


