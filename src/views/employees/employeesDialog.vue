<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" placeholder="请选择部门" style="width:50%" @focus="loadDepartment()" />
      <el-tree v-if="departments.length" :data="departments" :props="{label:'name'}" default-expand-all @node-click="hNodeClick" />
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <!-- 子向父传值 自定义方法 -->
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="hSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import empConstant from '@/constant/employees'
import { getDepartmentsList } from '../../api/departments'
import { tranListToTreeData } from '../../utils'
import { addEmployees } from '../../api/employees'
export default {
  data() {
    return {
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      hireType: empConstant.hireType,
      departments: []
    }
  },
  // created() {
  //   this.loadDepartment()
  // },
  methods: {
    async hSubmit() {
      try {
        // 兜底校验
        const valid = await this.$refs.addForm.validate().catch(e => e)
        if (!valid) return
        // 发请求
        const res = await addEmployees(this.formData)
        // 提示用户
        this.$message.success(res.message)
        // 关闭dialog 更新列表
        this.$emit('success')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    async loadDepartment() {
      // 如果有数据就不要再加载了
      if (this.departments.length) return
      const res = await getDepartmentsList()
      console.log(res)
      res.data.depts.shift()
      // 调用方法将扁平数组转化为树状图
      this.departments = tranListToTreeData(res.data.depts)
    },
    hNodeClick(data) {
      // console.log(data.children)
      // 判断是否有子节点, 如果有就不允许设置数据
      if (data.children.length) {
        return
      }
      // console.log('选中的是', data.name)
      // 1. 把当前选中的显示在input框中
      this.formData.departmentName = data.name
      // 隐藏 el-tree
      // 将数据清空就等于关闭 el-tree
      this.departments = []
    },
    resetForm() {
      // 清空表单项
      this.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      // 清空校验规则
      this.$nextTick(this.$refs.addForm.resetFields())
    }
  }
}
</script>
<style lang="scss" scoped>
 .el-tree{
   width: 50%;
   user-select: none;
 }

</style>
