<template>
  <div class="attendances-container">
    <div class="app-container">
      <el-card>
        <!-- 具体页面结构 -->
        考勤管理
        <sync :count.sync="num" />
      </el-card>
    </div>
  </div>
</template>
<script>
import sync from '@/views/attendances/sync'
export default {
  components: {
    sync
  },
  data() {
    return {
      num: 0
    }
  }
}
</script>
