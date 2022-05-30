<template>
  <div>
    每天洗澡次数：{{ count }}
    <el-button type="primary" @click="$emit('update:count',count+1)">准备继续去洗澡</el-button>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true
    }
  }
}
</script>
