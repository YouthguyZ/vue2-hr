<template>
  <div class="employees-container">
    <div class="app-container">
      <page-tools>
        <template #left>
          <span>本月:社保在缴 公积金在缴</span>
        </template>
        <template #right>
          <el-button type="warning">导入Excel</el-button>
          <el-button type="danger">导出Excel</el-button>
          <el-button type="primary" @click="showDialog=true">员工信息</el-button>
        </template>
      </page-tools>
      <el-card style="margin-top:20px">
        <!-- 具体页面结构 -->
        <!-- 员工 -->
        <el-table :data="employees">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像">
            <template v-slot="{row}">
              <img class="avatar" :src="row.staffPhoto" alt="">
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="聘用形式">
            <template v-slot="{row}">
              {{ formatEmployees(row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column sortable label="入职时间" prop="timeOfEntry" />
          <el-table-column label="操作" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small" @click="hDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          :current-page="q.page"
          :page-sizes="[5, 8, 20, 25]"
          :page-size="q.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="hSizeChange"
          @current-change="hCurrentChange"
        />
      </el-card>
    </div>
    <el-dialog
      title="新增员工"
      :visible.sync="showDialog"
      width="35%"
    >
      <empDialog @close="showDialog=false" />
    </el-dialog>>
  </div>
</template>
<script>
import EmployeesMenu from '@/constant/employees'
import { getEmployees, delEmployees } from '../../api/employees'
// 引入子组件 表单组件
import empDialog from '@/views/employees/employeesDialog.vue'
// 准备一个映射对象, 最终目标是: { 1: '正式', 2: '非正式' }
const hireTypeMap = {}
// 可选作业: 把 forEach 变成 reduce
// 执行循环后达成目标: { 1: '正式', 2: '非正式' } 不是很理解？
EmployeesMenu.hireType.forEach(item => {
  hireTypeMap[item.id] = item.value
})
export default {
  components: {
    empDialog
  },
  data() {
    return {
      employees: [],
      q: {
        page: 1,
        size: 10
      },
      total: 0,
      showDialog: false
    }
  },
  created() {
    this.loadEmployees()
  },
  methods: {
    async loadEmployees() {
      const res = await getEmployees(this.q)
      // console.log(res)
      this.total = res.data.total
      this.employees = res.data.rows
    },
    formatEmployees(code) { // code===1,code===2
    // hireType 引进constant里定义的常量
      // const result = EmployeesMenu.hireType.find(item => item.id === code)
      // // return result.value
      // if (result) {
      //   return result.value
      // } else {
      //   return '未知'
      // }
      return hireTypeMap[code]
    },
    hSizeChange(size) {
      this.q.size = size
      this.loadEmployees()
    },
    hCurrentChange(page) {
      this.q.page = page
      this.loadEmployees()
    },
    async hDel(id) {
      try {
        // 弹框提示用户
        await this.$confirm('确定删除吗？', '提示', { type: 'warning' })
        // 发请求
        const res = await delEmployees(id)
        // 根据信息提示用户
        this.$message.success(res.message)
        // 更新数据
        this.loadEmployees()
      } catch (e) {
        if (e === 'cancel') return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// 头像样式 尺寸
  .avatar{
    width: 50px;
    height: 50px;
  }
  .pagination{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    margin-top: 15px;
  }
</style>
