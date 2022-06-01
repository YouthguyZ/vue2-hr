<template>
  <el-form ref="deptForm" label-width="120px">
    <el-form-item label="部门名称">
      <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门编码">
      <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门负责人">
      <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
        <el-option v-for="item in employees" :key="item.id" :value="item.username" :label="item.username" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门介绍">
      <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
      <el-button size="small" @click="hCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getEmployeesList } from '@/api/employees'
import { addDepartments, getDepartmentsDetail, editDepartmentsById } from '../../api/departments'
export default {
  // 父向子传值 id
  props: {
    id: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      employees: []

    }
  },
  created() {
    this.loadEmployees()
    this.loadDepartmentsDetail()
  },
  methods: {
    async loadDepartmentsDetail() {
      if (!this.isEdit) return
      const res = await getDepartmentsDetail(this.id)
      console.log(res)
      // 数据回填
      this.form = res.data
    },
    hSubmit() {
      if (this.isEdit) {
        this.doEdit()
      } else {
        this.doAdd()
      }
    },
    // 添加部门
    async doAdd() {
      try {
      // 0.绑定点击事件
      // 1.兜底校验
      // 2.发送请求
        this.form.pid = this.id
        const res = await addDepartments(this.form)
        console.log(res)
        // 3.提示信息
        this.$message.success(res.message)
        // 4.关闭dialog
        // 5.更新数据
        this.$emit('success')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    // 修改信息
    async doEdit() {
      try {
      // 0.绑定点击事件
      // 1.兜底校验
      // 2.发送请求
        const res = await editDepartmentsById(this.form)
        console.log(res)
        // 3.提示信息
        this.$message.success(res.message)
        // 4.关闭dialog
        // 5.更新数据
        this.$emit('edit')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    hCancel() {},
    async loadEmployees() {
      try {
        const res = await getEmployeesList()
        console.log(res)
        this.employees = res.data
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>
