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
                @click="hAdd"
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
                  <el-button size="small" type="success" @click="hAssgin(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="hEdit(row)">编辑</el-button>
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
    <!-- 新增弹框 -->
    <el-dialog
      :title="isEdit?'编辑':'添加'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showDialog"
      @closed="hClose"
    >
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="showDialog=false">取消</el-button>
          <el-button size="small" type="primary" @click="hSubmit">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 新增弹框分配权限 -->
    <el-dialog
      title="分配权限"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showDialogAssgin"
    >
      <assignPermission v-if="showDialogAssgin" :id="curId" @close="showDialogAssgin=false" />
    </el-dialog>
  </div>
</template>
<script>
// 导入角色权限分配dialog组件
import assignPermission from './assignPermission.vue'
import { getRoles, delRolesById, addRoles, updateRoles } from '@/api/roles'
export default {
  components: {
    assignPermission
  },
  data() {
    return {
      q: {
        page: 1,
        pagesize: 2
      },
      roles: [],
      total: 0,
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      // 设置状态
      isEdit: false,
      showDialogAssgin: false,
      curId: ''
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    async loadRoles() {
      try {
        const res = await getRoles(this.q)
        // console.log(res)
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
        // 修复删除小bug 最后一页删除完变空白
        if (this.roles.length === 1 && this.q.page > 1) {
          this.q.page--
        }
        // 更新列表渲染
        this.loadRoles()
      } catch (e) {
        // 进入了 catch 表示用户点了取消
        // 请求失败也会进入 catch
        console.log(e)
      }
    },
    hSubmit() {
      // 1.兜底校验
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return
        // 三元判断
        this.isEdit ? this.doEdit() : this.doAdd()
      })
    },
    async doAdd() {
      try {
        // 2.发请求
        const res = await addRoles(this.roleForm)
        // console.log(res)
        // 3.提示用户
        if (res.code !== 10000) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 4.关闭dialog
        this.showDialog = false
        // total取余页条数
        if (this.total % this.q.pagesize === 0) {
          this.total++
        }
        // 新增数据后跳到后一面 页数向上取整
        this.q.page = Math.ceil(this.total / this.q.pagesize)
        // 5.渲染更新页面
        this.loadRoles()
      } catch (e) { console.log(e) }
    },
    async doEdit() {
      try {
        // 2.发请求
        const res = await updateRoles(this.roleForm)
        console.log(res)
        // 3.提示用户
        if (res.code !== 10000) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 4.关闭dialog
        this.showDialog = false
        // 5.渲染更新页面
        this.loadRoles()
      } catch (e) { console.log(e) }
    },
    hEdit(row) {
      // 显示dialog
      this.showDialog = true
      // 数据回填 浅拷贝变深拷贝
      this.roleForm = { ...row }
      // 设置状态
      this.isEdit = true
    },
    hAdd() {
      this.showDialog = true
      // 设置状态
      this.isEdit = false
    },
    hClose() {
      // 清空表单
      this.roleForm = {
        name: '',
        description: ''
      }
      // 重置表单清空校验
      this.$refs.roleForm.clearValidate()
    },
    hAssgin(id) {
      this.showDialogAssgin = true
      this.curId = id
    }
  }
}
</script>
