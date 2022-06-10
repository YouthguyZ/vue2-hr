<template>
  <div>
    <!-- check-strictly :严格模式
          default-expand-all:全部展开
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
export default {
  data() {
    return {
      permission: []
    }
  },
  created() {
    this.loadPermisson()
  },
  methods: {
    async loadPermisson() {
      const res = await getPermissionList()
      // 转树状结构
      this.permission = tranListToTreeData(res.data)
    },
    hSubmit() {
      const lds = this.$refs.tree.getCheckedNodes()
      console.log(lds)
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
