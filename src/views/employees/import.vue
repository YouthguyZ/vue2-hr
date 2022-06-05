<template>
  <div style="margin-top:70px">
    <upload-excel :on-success="handleSuccess" />
  </div>
</template>

<script>
export default {
  methods: {
    // beforeUpload(file) {
    //   const isLt1M = file.size / 1024 / 1024 < 1
    //   if (isLt1M) {
    //     return true
    //   }
    //   this.$message({
    //     message: 'Please do not upload files larger than 1m in size.',
    //     type: 'warning'
    //   })
    //   return false
    // },
    handleSuccess({ results, header }) {
      console.log(results, header)
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>

<style>

</style>
