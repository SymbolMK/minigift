import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Banner = new Schema({
  name: String,
  isActive: {
    type: Boolean,
    default: false
  },
  hash: String,
  key: String,
  url: String,
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

Banner.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.updatedAt = Date.now()
  } else {
    this.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Banner', Banner)
