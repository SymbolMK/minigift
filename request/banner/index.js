import rp from '~/common/fetch'

class Service {
  asyBanList(params = {}) {
    return rp.get('/banner/list', { params })
  }

  banSave(params = {}) {
    return rp.post('/banner/save', params)
  }

  banDel(params = {}) {
    return rp.delete('/banner/del', { params })
  }

  update(params = {}) {
    return rp.put('/banner/update', params)
  }
}

export default new Service()
