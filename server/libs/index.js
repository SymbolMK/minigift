import qiniu from 'qiniu'
import { exec } from 'shelljs'
import config from '../config'

const ACCESS_KEY = config.qiniu.AK
const SECRET_KEY = config.qiniu.SK

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY)
const QConf = new qiniu.conf.Config()
QConf.zone = qiniu.zone.Zone_z2
const bucketManager = new qiniu.rs.BucketManager(mac, QConf)
// 获取token
export const uptoken = (key) => {
  return new qiniu.rs.PutPolicy({ scope: `${bucket}:${key}` }).uploadToken(mac)
}

// 删除文件
export const deleteFile = (key) =>
  new Promise((resolve, reject) => {
    bucketManager.delete(bucket, key, (err, respBody, respInfo) => {
      if (err) {
        reject({
          success: false,
          code: 201,
          data: err
        })
      } else {
        resolve({
          success: true,
          data: respInfo
        })
      }
    })
  })

// 因为七牛抓取互联网资源这个 node SDK 有坑，所以直接用 qshell，所以使用前需要全局安装
// npm i qshell -g
// 然后配置账号
// qshell account <你的AK> <你的SK>
export const fetchImage = async (url, key) =>
  new Promise((resolve, reject) => {
    const bash = `qshell fetch ${url} ${bucket} '${key}'`

    exec(bash, (code, stdout, stderr) => {
      if (stderr) return reject(stderr)
      if (stdout === 'Fetch error, 504 , xreqid:') return reject(stdout)

      resolve(stdout)
    })
  })
