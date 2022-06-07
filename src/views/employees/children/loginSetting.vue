<template>
  <el-form
    ref="userForm"
    :rules="rules"
    :model="userInfo"
    label-width="120px"
    style="margin-left: 120px; margin-top: 30px"
  >
    <el-form-item label="姓名:" prop="username">
      <el-input v-model="userInfo.username" style="width:300px" />
    </el-form-item>
    <el-form-item label="密码:" prop="password">
      <el-input v-model="userInfo.password" type="password" style="width:300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="hUplate">更新</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getUserDetailById, updateUserDetailById } from '../../../api/employees'
export default {
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
      }
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      const res = await getUserDetailById(this.$route.query.id)
      // 数据回填
      this.userInfo = res.data
    },
    async hUplate() {
      // 兜底校验
      const valid = await this.$refs.userForm.validate().catch(e => e)
      if (!valid) return
      try {
        // 发请求
        const res = await updateUserDetailById(this.userInfo)
        // 提示用户
        this.$message.success(res.message)
        // 返回上一级
        this.$router.back()
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>

