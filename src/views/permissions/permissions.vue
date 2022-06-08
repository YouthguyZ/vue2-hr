<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="hAdd(1,'0')">添加权限</el-button>
        </div>
        <!-- 树状结构的话 table 要加上 row-key="id"唯一值标识 -->
        <el-table row-key="id" default-expand-all :data="permission" border>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <!-- type为1时为页面级访问权限，它可以继续做添加： 设置页面下边某个功能是否可以操作 -->
              <!-- type为2时为按钮级别的访问权限，它就不能再继续细分了，它就没有添加了 -->
              <el-button v-if="row.type===1" type="text" @click="hAdd(2,row.id)">添加</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog :visible.sync="showDialog" title="弹层标题">
      <!-- 表单内容 -->
      <el-form label-width="100px">
        <el-form-item label="权限名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right;">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permissions'
import { tranListToTreeData } from '../../utils'
export default {
  data() {
    return {
      permission: [],
      showDialog: false, // 是否显示弹层
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      }
    }
  },
  created() {
    this.loadPermission()
  },
  methods: {
    async loadPermission() {
      const res = await getPermissionList()
      // console.log(res)
      // 转换树状图
      this.permission = tranListToTreeData(res.data)
    },
    hAdd(type, pid) {
      console.log(type, pid)
      this.showDialog = true
    }
  }
}
</script>
