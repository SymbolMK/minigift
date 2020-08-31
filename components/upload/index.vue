<style lang="sass" scoped>
.el-upload,.el-upload-list__item
  width: 120px
  height: 120px
  line-height: 120px
  position: relative
  overflow: hidden
  .el-upload-list__item-status-label
    .el-icon-check
      position: absolute
      top: 0
      left: 15px
  input
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    opacity: 0
    z-index: 2
    display: block !important
</style>
<template lang="pug">
  div.wrapper
    .el-upload-list.el-upload-list--picture-card(v-for='(item, l) in previewData',:key='item._id')
      .el-upload-list__item.is-success
        el-image.el-upload-list__item-thumbnail(:src='item.url', ref='elImage2', lazy, fit='cover')
        a.el-upload-list__item-name
          i.el-icon-document
        label.el-upload-list__item-status-label
          i.el-icon-upload-success.el-icon-check
        i.el-icon-close
        span.el-upload-list__item-actions
          span.el-upload-list__item-preview(@click='previewImage(l)')
            i.el-icon-zoom-in
          span.el-upload-list__item-delete(@click='deleteImage(item)')
            i.el-icon-delete
    .el-upload.el-upload--picture-card(v-if='canUpload')
      i.el-icon-plus
      input(type="file" ref='upload2' accept='image/png, image/jpg, image/jpeg, image/gif' name="file" class="el-upload__input"  @change='uploadImg')

    el-image-viewer(v-if='showViewer' :on-close='closeViewer' :url-list='previewArr' :initial-index='currentIndex')
</template>

<script>
import { uploadImg, deleteImg } from '~/common/qiniu'
export default {
  components: {
    elImageViewer: () => import('element-ui/packages/image/src/image-viewer')
  },
  props: {
    canUpload: {
      type: Boolean,
      default: true
    },
    realDel: {
      type: Boolean,
      default: true
    },
    part: {
      type: String,
      default: ''
    },
    previewData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      showViewer: false
    }
  },
  computed: {
    previewArr() {
      return this.previewData.map((el) => el.url)
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {
    closeViewer() {
      this.showViewer = false
    },
    previewImage(l) {
      this.currentIndex = l
      this.showViewer = true
    },
    uploadImg(e) {
      const file = e.target.files[0]
      uploadImg({ file, module: this.part }).then((res) => {
        this.$emit('uploadend', res)
      })
    },
    async deleteImage(item) {
      if (this.realDel) {
        await deleteImg(item.key)
      }
      this.$emit('deleted', { item, realDel: this.realDel })
    }
  }
}
</script>
