import mongoose from 'mongoose'
import consola from 'consola'
import conf from '../config'

const Ban = mongoose.model('Banner')

export async function save({ name, isActive = false, hash, key }) {
  const banner = await new Ban({
    name,
    isActive,
    hash,
    key,
    url: `${conf.base}/${key}`
  })

  try {
    const res = await banner.save()
    return res
  } catch (error) {
    return false
  }
}

export async function delBan({ id }) {
  try {
    const res = await Ban.findOneAndRemove({ _id: id }).exec()
    return res
  } catch (error) {
    return false
  }
}

export async function getList(params) {
  const pageSize = Number(params.pageSize) || 20
  const page = Number(params.page) || 1
  let total = 0
  let data = []
  if (params.needActive) {
    total = await Ban.count({ isActive: true }).exec()
    data = await Ban.find(
      { isActive: true },
      { __v: 0, hash: 0, meta: 0 }
    ).exec()
    return {
      total,
      data
    }
  } else {
    total = await Ban.count({ isActive: false }).exec()
    data = await Ban.find({ isActive: false }, { __v: 0, hash: 0, meta: 0 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .exec()

    return {
      total,
      current: page,
      data
    }
  }
}

export async function update(params) {
  try {
    const res = await Ban.updateMany(
      { _id: { $in: params.data } },
      { $set: { isActive: params.isActive || false } }
    ).exec()
    return res
  } catch (err) {
    return false
  }
}
