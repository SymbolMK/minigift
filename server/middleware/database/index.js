import fs from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import consola from 'consola'
import config from '../../config'
const models = resolve(__dirname, '../../database/schema')

fs.readdirSync(models)
  .filter((file) => ~file.search(/^[^\.].*js$/))
  .forEach((file) => require(resolve(models, file)))

const database = (app) => {
  mongoose.set('debug', true)

  mongoose.connect(config.db)

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db)
  })

  mongoose.connection.on('error', (error) => {
    consola.log(error)
  })

  mongoose.connection.on('open', async () => {
    consola.log('已连接MongoDB', config.db)

    const User = mongoose.model('User')

    let user = await User.findOne({
      role: 'admin',
      username: '403756835@qq.com'
    }).exec()

    if (!user) {
      user = new User({
        role: 'admin',
        username: '403756835@qq.com',
        password: 'root123',
        sex: '男',
        name: '马铭泽',
        avatar: 'http://qiniu.soulferry.xyz/avatar.jpeg'
      })

      user.save()
    }
  })
}

export { database }
