<template>
  <el-pagination
    :current-page="page"
    :page-sizes="[10, 20, 40, 60, 80, 100]"
    :page-size="pageSize"
    layout="sizes, total, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
  </el-pagination>
</template>
<script>
export default {
  props: {
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
    handleSizeChange(val) {
      const me = this
      me.$emit('handleSizeChange', val)
      return false
    },
    handleCurrentChange(val) {
      const me = this
      me.$emit('handleCurrentChange', val)
      return false
    }
  }
}
</script>
