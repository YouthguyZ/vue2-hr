<template>
  <div class="footer">
    <el-button type="" @click="$emit('close')">取消</el-button>
    <el-button type="primary">确定</el-button>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.footer{
  display: flex;
  justify-content: end;
}

</style>
