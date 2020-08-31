<style lang="sass" scoped>
.wrapper
  width: 100%
  height: 100%
  font-size: 0
  user-select: none
  padding: 0 30px
  .left
    display: flex
    align-items: center
    .logo
      display: inline-block
      width: 48px
      height: 48px
      overflow: hidden
      img
        width: 48px
        height: 48px
    .category-box
      color: black
      display: inline-block
      vertical-align: top
      line-height: 48px
      margin-left: 30px
      font-size: 28px
      cursor: pointer
      margin-right: 42px
  .right
    line-height: 60px
    text-align: right
    .right-menu-item
      display: inline-block
      margin: 0 18px
    .signout
      .el-button
        vertical-align: middle
        padding: 5px 15px
</style>

<template lang="pug">
  el-row.wrapper(type='flex' align='center')
    el-col.left
      span.logo
        img(src='http://qiniu.soulferry.xyz/gutar.gif')
      el-tooltip(effect='dark' content='菜单开关' placement='bottom')
        span.category-box(@click='toggleMenu')
          i.el-icon-menu
      breadcrumb.breadcrumb
    el-col.right
      el-tooltip(effect='dark' content='全屏' placement='bottom')
        full-screen.screenfull.right-menu-item
      span.signout
        el-button(@click='signout') 退出
</template>

<script>
import breadcrumb from '~/components/breadcrumb/index'
import fullScreen from '~/components/fullscreen/index'
export default {
  components: {
    fullScreen,
    breadcrumb
  },
  data: () => {
    return {}
  },
  methods: {
    toggleMenu() {
      this.$store.dispatch('togglemenu')
    },
    async signout() {
      await this.$store.dispatch('logout')
      window.location.reload()
    }
  }
}
</script>
