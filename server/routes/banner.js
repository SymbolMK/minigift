import api from '../api'
import { controller, get, post, required, del, put } from '../decorator/router'
import xss from 'xss'
import R from 'ramda'

@controller('/banner')
export class bannerController {
  @post('save')
  @required({body: ['name', 'isActive', 'hash', 'key']})
  async save(ctx, next) {
    const { name, isActive, hash, key } = ctx.request.body
    const params = {
      name: xss(name),
      isActive: xss(isActive),
      hash: xss(hash),
      key: xss(key)
    }

    try {
      const res = await api.banner.save(params)
      if (res) {
        ctx.body = {
          succss: true,
          code: 200,
          message: '添加成功'
        }
      } else {
        ctx.body = {
          succss: false,
          code: 500,
          message: '添加失败'
        }
      }
    } catch (error) {
      ctx.body = {
        succss: false,
        code: 500,
        message: error
      }     
    }

  }

  @del('del')
  @required({ query: ['_id'] })
  async delthis(ctx, next) {
    const { _id } = ctx.query
    try {
      const res = await api.banner.delBan({id: xss(_id)})
      if (res) {
        ctx.body = {
          succss: true,
          code: 200,
          message: '删除成功'
        }
      } else {
        ctx.body = {
          succss: false,
          code: 500,
          message: '删除失败'
        }
      }
    } catch (error) {
      ctx.body = {
        succss: false,
        code: 500,
        message: error
      }
    }
  }

  @get('list')
  async bannerlist(ctx, next) {
    const params = ctx.query
    try {
      const res = await api.banner.getList(params)
      if (res) {
        ctx.body = {
          succss: true,
          code: 200,
          data: res,
          message: '成功'
        }
      } else {
        ctx.body = {
          succss: false,
          code: 500,
          message: '失败'
        }
      }
    } catch (error) {
      ctx.body = {
        succss: false,
        code: 500,
        message: error
      }
    }
  }

  @put('update')
  async update(ctx, next) {
    const { isActive, data } = ctx.request.body
    const params = {
      isActive: isActive,
      data: R.map(el => xss(el))(data)
    }
    try {
      const res = await api.banner.update(params)
      if (res) {
        ctx.body = {
          succss: true,
          code: 200,
          message: '成功'
        }
      } else {
        ctx.body = {
          succss: false,
          code: 500,
          message: '失败'
        }
      }
    } catch (error) {
      ctx.body = {
        succss: false,
        code: 500,
        message: error
      }
    }
  }
}