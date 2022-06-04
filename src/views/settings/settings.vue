<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roles">
              <!-- type="index"elementui定义的序号 -->
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button size="small" type="danger" @click="hDel(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :current-page="q.page"
                :page-sizes="[2, 3, 5, 10]"
                :page-size="q.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="hSizeChange"
                @current-change="hCurrentChange"
              />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getRoles, delRolesById } from '@/api/roles'
export default {
  data() {
    return {
      q: {
        page: 1,
        pagesize: 2
      },
      roles: [],
      total: 0
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    async loadRoles() {
      try {
        const res = await getRoles(this.q)
        console.log(res)
        this.roles = res.data.rows
        this.total = res.data.total
      } catch (e) {
        console.log(e)
      }
    },
    hSizeChange(pagesize) {
      this.q.pagesize = pagesize
      this.loadRoles()
    },
    hCurrentChange(page) {
      this.q.page = page
      this.loadRoles()
    },
    async hDel(id) {
      // this.$confirm('确定要删除吗？', '提示', { type: 'warning' })
      //   .then(async() => {
      //     // 发ajax请求
      //     const res = await delRolesById(id)
      //     // 提示用户信息
      //     this.$message.success(res.message)
      //     // 更新列表渲染
      //     this.loadRoles()
      //   })
      //   .catch(() => {})

      // 语法: await promise对象 (绝大部分场景都是这样)
      // 返回值: 是 .then 第一个回调函数的第一个参数 (.then 的成功结果)
      // const result = await this.$confirm('真的要删除吗?嘤嘤嘤!', '提示', { type: 'warning' })
      // if (result === 'confirm') // 表示用户点了确定
      // console.log(result) // confirm
      // 如何表示用户点了取消呢? --> 直接点取消会报错
      // 使用异常处理方案:
      // await 最标准的异常处理方案: try - catch
      try {
        // 基础版优化嵌套 优化逻辑
        await this.$confirm('确定要删除吗？', '提示', { type: 'warning' })
        // 发ajax请求
        const res = await delRolesById(id)
        // 提示用户信息
        this.$message.success(res.message)
        // 更新列表渲染
        this.loadRoles()
      } catch (e) {
        // 进入了 catch 表示用户点了取消
        // 请求失败也会进入 catch
        console.log(e)
      }
    }
  }
}
</script>
