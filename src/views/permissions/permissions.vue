<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small">添加权限</el-button>
        </div>
        <el-table row-key="id" default-expand-all :data="permission" border>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template>
              <el-button type="text">添加</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permissions'
import { tranListToTreeData } from '../../utils'
export default {
  data() {
    return {
      permission: []
    }
  },
  created() {
    this.loadPermission()
  },
  methods: {
    async loadPermission() {
      const res = await getPermissionList()
      console.log(res)
      // 转换树状图
      this.permission = tranListToTreeData(res.data)
    }
  }
}
</script>
