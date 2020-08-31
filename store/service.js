import axios from '~/common/fetch'

class Service {
  login(params) {
    return axios.post('/admin/login', params)
  }

  logout() {
    return axios.post('/admin/logout')
  }
}

export default new Service()
