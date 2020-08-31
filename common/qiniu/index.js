import randomToken from 'random-token'
import * as QINIU from 'qiniu-js'
import axios from 'axios'

const getUptoken = async (key) => {
  const res = await axios.get('/qiniu/token', {
    params: {
      key
    }
  })
  return res.data.data.token
}

export const uploadImg = ({ file, module }) => {
  return new Promise(async (resolve, reject) => {
    let key = randomToken(32)

    key = `${module}/${key}`

    const token = await getUptoken(key)
    const putExtra = {
      fname: '',
      params: {},
      mimeType: null
    }
    const observable = QINIU.upload(file, key, token, putExtra, {
      useCdnDomain: true,
      region: QINIU.region.z2
    })
    observable.subscribe({
      next(res) {},
      error(err) {
        reject(err)
      },
      complete(res) {
        resolve(res)
      }
    })
  })
}
export const deleteImg = (key) => {
  return axios.delete('/qiniu/delete', {
    params: {
      key
    }
  })
}
