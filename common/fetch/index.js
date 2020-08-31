import axios from 'axios'
import { Loading, Notification } from 'element-ui'
const timeout = 10000
const BaseUrl = ''
const fetch = axios.create({
  BaseUrl,
  timeout,
  headers: {
    'Content-Type': 'application/json'
  }
})
let loadingInstance = null
let notify = null
// 请求拦截
fetch.interceptors.request.use(
  function(config) {
    loadingInstance = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    return config
  },
  function(error) {
    loadingInstance.close()
    return Promise.reject(error)
  }
)

// 响应截断器
fetch.interceptors.response.use(
  function(response) {
    setTimeout(() => {
      loadingInstance.close()
    }, 300)
    if (notify) notify.close()
    if (response.data.code !== 200) {
      notify = Notification.error(response.data.message || '网络错误')
    }
    return response.data
  },
  function(error) {
    loadingInstance.close()
    notify = Notification.error(error)
    return Promise.reject(error)
  }
)

export default fetch
