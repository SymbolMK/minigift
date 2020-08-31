<style lang="sass" scoped>
.wrapper
  width: 100%
  height: 100%
  .header
    padding: 0
    width: 100%
    font-size: 0
    background: white
    box-shadow: 0 1px 3px rgba(26,26,26,.1)
    border-bottom: 1px solid #dbdfe1
    box-sizing: border-box
    background-clip: content-box
    overflow: hidden
  .el-aside
    height: 100%
    background: white
    border: none
    overflow: auto
    will-change: width
    transition: width 0.2s
  #main-content
    height: calc(100% - 60px)
    .el-main
      padding: 15px
      box-sizing: border-box
      height: 100%
      overflow: auto
</style>

<template lang="pug">
  el-container.wrapper
    el-header.header
      Header
    el-container#main-content
      el-aside(:style="{width: isCollapse ? '60px' : '200px' }")
        ASlide
      el-main.main
        nuxt
</template>

<script>
import { mapState } from 'vuex'
import Header from '~/components/header/index'
import ASlide from '~/components/slidebar/index'
export default {
  components: {
    Header,
    ASlide
  },
  data: () => {
    return {}
  },
  layout: 'default',
  computed: {
    ...mapState({
      isCollapse: (state) => state.isCollapse
    })
  }
}
</script>
