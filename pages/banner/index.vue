<style lang="sass" scoped>
@import '~/common/sass/index.sass'
.wrapper
  .item
    margin-bottom: 20px
    .i-container
      .el-card
        +square(146)
        .el-image
          width: 100%
          heigh: 100%
</style>
<template lang="pug">
  wall.wrapper
    el-col.item
      el-divider.title(content-position="left") 预览展示
      .i-container
        upload(:previewData='current', @uploadend='uploadend', @deleted='deleted', part='banner', :realDel='false')
        //- el-card(:body-style='{padding: "10px"}')
        //-   el-image(:src='previewSrc', lazy, :preview-src-list="[previewSrc]")
    el-col.item
      el-divider.title(content-position="left") 历史数据
      .i-container
        //- upload(:previewData='history', @deleted='deleted', part='banner', :canUpload='false')
        el-card(:body-style='{padding: "10px"}', v-for='el in history', :key='el._id')
          el-image(:src='el.url', lazy, :preview-src-list="historyArr", fit='cover')
</template>

<script>
import { mapState } from 'vuex'
import Service from '~/request/banner'
export default {
  middleware: 'auth',
  computed: {
    historyArr() {
      return this.history.map((el) => el.url)
    },
    ...mapState(['QNUrl'])
  },
  data() {
    return {
      current: [],
      history: []
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this._active()
    this._normal()
  },
  methods: {
    deleted({ item, realDel }) {
      if (realDel) {
        Service.banDel({ _id: item._id }).then((resp) => {
          this._active()
        })
      } else {
        Service.update({ data: [item._id], isActive: false }).then((resp) => {
          this._normal()
        })
      }
    },
    uploadend(res) {
      const params = {
        name: res.key,
        isActive: true,
        ...res
      }
      Service.banSave(params).then((resp) => {
        this._active()
      })
    },
    upload() {},
    async _active() {
      const data = await Service.asyBanList({ needActive: true })
      this.current = data.data.data
    },
    async _normal() {
      const data = await Service.asyBanList({})
      this.history = data.data.data
    }
  }
}
</script>
