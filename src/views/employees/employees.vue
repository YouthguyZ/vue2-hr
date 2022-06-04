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
          <el-button type="primary">员工信息</el-button>
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
          <el-table-column label="入职时间" prop="timeOfEntry" />
          <el-table-column label="操作" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import EmployeesMenu from '@/constant/employees'
import { getEmployees } from '../../api/employees'
export default {
  data() {
    return {
      employees: [],
      q: {
        page: 1,
        size: 10
      },
      total: 0
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
      const result = EmployeesMenu.hireType.find(item => item.id === code)
      // return result.value
      if (result) {
        return result.value
      } else {
        return '未知'
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
</style>
