<template>
  <!-- // 分配角色 -->
  <div>
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getRoles } from '../../api/roles'
import { getDetailByid } from '../../api/user'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      roleIds: [],
      roles: []
    }
  },
  created() {
    this.loadRoles()
    this.rolesIds()
  },
  methods: {
    async loadRoles() {
      const res = await getRoles()
      // console.log(res)
      this.roles = res.data.rows
    },
    closeDialog() {
      this.$emit('close')
    },
    // 获取信息根据传过来的id 发请求获取当前rolesIds
    async rolesIds() {
      const res = await getDetailByid(this.id)
      // console.log(res)
      this.roleIds = res.data.roleIds
    }
  }
}
</script>
