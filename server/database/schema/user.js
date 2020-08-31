const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// 定义数据的复杂等级， 默认就是10，等级最高就是10，1-3的话系统会认为太低，改为10
const SALT_WORK_FACTOR = 10
// 定义错误密码的最大尝试次数
const MAX_LOGIN_ATTEMPS = 5
// 锁定时间
const LOCK_TIME = 2 * 60 * 60 * 1000
const Schema = mongoose.Schema

const UserSchema = new Schema({
  role: {
    type: String,
    default: 'user'
  },
  sex: String,
  username: String,
  name: String,
  password: String,
  avatar: String,
  ip: String,
  addres: String,
  hashed_password: String,
  description: String,
  lockUntil: {
    type: Number
  },
  loginAttemps: {
    type: Number,
    default: 0
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
// schema 定义虚拟属性 虚拟属性具有set get 方法
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now)
})
// 定义虚拟方法将——id加密作为该条数据的token
UserSchema.virtual('token').get(function() {
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
  const token = bcrypt.hashSync(String(this._id), salt)
  return token
})

// 定义文档的钩子，或者说内部方法的回调
UserSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.updatedAt = Date.now()
  } else {
    this.updatedAt = Date.now()
  }
  next()
})

UserSchema.pre('save', function(next) {
  const user = this
  // isModified 检查是否修改过，如果修改过则返回true，否则返回false。 如果没有映射，则始终返回true。
  if (!user.isModified('password')) return next()
  // bcrypt 加密数据，
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) next(error)
      user.password = hash
      next()
    })
  })
})

// schema 实例化内部方法
UserSchema.methods = {
  comparePassword(_password, password) {
    return new Promise((resolve, reject) => {
      // 通过bcrypt对比两个密码是否一致
      bcrypt.compare(_password, password, function(err, isMatch) {
        if (!err) resolve(isMatch)
        return reject(err)
      })
    })
  },
  incLoginAttemps(user) {
    const that = this
    return new Promise((resolve, reject) => {
      // 第一次尝试错误
      if (that.lockUntil && this.lockUntil < Date.now()) {
        // 如果尝试之后还是错误，则将尝试次数加1，$set为mongoose的原子操作
        // $unset 删除某个键
        that.update({
          $set: {
            loginAttemps: 1
          },
          $unset: {
            lockUntil: 1
          }
        })
      }
      // 设置attemps自增减
      const updates = {
        $inc: {
          loginAttemps: 1
        }
      }
      // 如果超出最大尝试次数，则锁定
      if (that.loginAttemps + 1 > MAX_LOGIN_ATTEMPS && !that.isLocked) {
        updates.$set = {
          lockUntil: Date.now() + LOCK_TIME
        }
      }
      that.update(updates, (err) => {
        if (!err) resolve(true)
        else reject(err)
      })
    })
  }
}

mongoose.model('User', UserSchema)
