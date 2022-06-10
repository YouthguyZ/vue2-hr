<template>
  <div>
    <!-- check-strictly :严格模式
          default-expand-all:全部展开
          如果需要通过 key 来获取或设置，则必须设置node-key。
     -->
    <el-tree
      ref="tree"
      :data="permission"
      :props="{label:'name'}"
      default-expand-all
      show-checkbox
      node-key="id"
      check-strictly
    />
    <div class="footer">
      <el-button type="" @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="hSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getPermissionList } from '../../api/permissions'
import { tranListToTreeData } from '../../utils'
import { getRolesDetail, assignPermission } from '../../api/roles'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      permission: []
    }
  },
  created() {
    // 获取所有的权限列表
    this.loadPermisson()
    // 获取当前角色拥有的权限
    this.loadRoleById()
  },
  methods: {
    async loadPermisson() {
      const res = await getPermissionList()
      // 转树状结构
      this.permission = tranListToTreeData(res.data)
    },
    async hSubmit() {
      try {
        // 如果需要通过 key 来获取或设置，则必须设置node-key。
        // 勾选项的 id
        const lds = this.$refs.tree.getCheckedKeys()
        // console.log(lds, this.id)
        const res = await assignPermission({ id: this.id, permIds: lds })
        this.$message.success(res.message)
        // 关闭dialog
        this.$emit('close')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    async loadRoleById() {
      try {
        // 获取角色列表 拿到 premIds
        const res = await getRolesDetail(this.id)
        // console.log(res)
        // 默认选中
        this.$refs.tree.setCheckedKeys(res.data.permIds)
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.footer{
  display: flex;
  justify-content: end;
}

</style>
