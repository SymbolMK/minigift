<style lang="sass" scoped>
.wrapper
  color: #303133
  font-size: 0
  border: none
  .el-menu-item
    .link
      color: #303133
      text-decoration: none
      .mini
        font-size: 12px
</style>

<template lang="pug">
  el-menu.wrapper(:collapse='isCollapse')
    el-menu-item(v-for='(item,i) in adminRoute',:key='i', v-if='!item.hidden')
      nuxt-link.link(:to='item.path')
        i(:class='item.meta.cls')
        span.mini {{item.name}}
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => {
    return {
      adminRoute: [
        {
          name: '首页导图',
          path: '/banner',
          meta: {
            cls: 'el-icon-s-shop'
          }
        },
        {
          name: '热门推荐',
          path: '/hotset',
          meta: {
            cls: 'el-icon-user-solid'
          }
        },
        {
          name: '图包分类',
          path: '/imgclslist',
          meta: {
            cls: 'el-icon-platform-eleme'
          }
        },
        {
          name: '套路分类',
          path: '/routine',
          meta: {
            cls: 'el-icon-s-comment'
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      isCollapse: (state) => state.isCollapse
    })
  }
}
</script>
