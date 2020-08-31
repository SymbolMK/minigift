const mongoose = require('mongoose')
const Schema = mongoose.Schema
const consola = require('consola')

const Token = new Schema({
  name: String,
  access_token: String,
  expires_in: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
})

Token.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
// 加载一个ES6 Class到 schema 中。并将映射 ES6 Class 中setters\getters、静态方法和实例方法为 schema virtuals、statics和methods。
// schema添加静态方法
Token.static = {
  async getAccessToken() {
    const token = await this.findOne({ name: 'access_token' }).exec()
    return token
  },
  async saveAccessToken(data) {
    let token = await this.findOne({ name: 'access_token' }).exec()
    if (token) {
      token.access_token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new Token({
        name: 'access_token',
        access_token: data.access_token,
        expires_in: data.expires_in
      })
    }
    try {
      await token.save()
    } catch (error) {
      consola.log(error)
    }
    return token
  }
}

mongoose.model('Token', Token)
