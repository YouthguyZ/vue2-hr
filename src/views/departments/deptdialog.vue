<template>
  <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="部门名称" prop="name">
      <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门编码" prop="code">
      <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门负责人" prop="manager">
      <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
        <el-option v-for="item in employees" :key="item.id" :value="item.username" :label="item.username" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门介绍" prop="introduce">
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
    },
    originList: {
      type: Array,
      required: true
    }
  },
  data() {
    // 自定义校验 部门编号-非重验证
    // rule 行参 没用
    // value 当前校验的值
    // callback 回调函数
    const codeValida = (rule, value, callback) => {
      // 筛选父组件传过来的源数据 将code值挑出来
      // 1. 从originList（[{id, pid,name, code},{id, pid,name, code}]）中找出全部的编码数据
      // let codeList = this.originList.map(({ code }) => code)
      let codeList = null
      // 编辑状态的特殊处理: 将当前正在编辑的部门从数组中给删掉 (不要修改原数组)
      // 编辑状态: isEdit
      if (this.isEdit) {
        // 把当前正在编辑的部门编号（this.id）排除在外
        // filter: 过滤出「除了」正在编辑的部门以外的所有部门
        codeList = this.originList.filter(item => item.id !== this.id).map(({ code }) => code)// 将正在编辑的部门给排除在外
      } else {
        // 添加子部门状态
        codeList = this.originList.map(({ code }) => code)
      }
      // if (codeList.includes(value)) {
      //   callback(new Error(value + '已存在'))
      // } else {
      //   callback()
      // }
      // 同上 三元运算表达式  校验
      codeList.includes(value) ? callback(new Error(value + '已存在')) : callback()
    }
    // 自定义校验 同级不能重复命名
    const nameValida = (rule, value, callback) => {
      // console.log('用户输入的部门名称:', value)
      // 需求: 部门名称统计不允许重复
      // 拆解需求:
      // 1. 添加时不允许和子部门名称重复
      // 2. 编辑时不允许和兄弟部门名称重复

      // 解决需求1: 找到当前点击部门的子部门, 判断是否在其中
      // this.id => 当前点击的部门
      // nameList = this.originList.filter(item => item.pid === this.id).map(({ name }) => name)
      // let nameList = this.originList.map(({ name }) => { name })
      let nameList = null
      // 解决需求2: 编辑时, 通过 id 找到兄弟部门, 并判断是否在其中
      // this.id => 当前点击的部门
      if (this.isEdit) {
        // 根据当前点击的部门 id 找到父部门 id
        const pid = this.originList.find(item => item.id === this.id).pid
        // 根据pid过滤出所有子部门，就是兄弟部门
        nameList = this.originList.filter(item => item.pid === pid && item.id !== this.id).map(({ name }) => name)
      } else {
        // 添加命名状态
        nameList = this.originList.filter(item => item.pid === this.id).map(({ name }) => name)
      }
      // 校验判断
      if (nameList.includes(value)) {
        callback(new Error(name + value + '已存在'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10个字符', trigger: 'blur' },
          { validator: nameValida, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10个字符', trigger: 'blur' },
          { validator: codeValida, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请选择部门负责人', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10个字符', trigger: 'blur' }
        ]
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
      // console.log(res)
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
      this.$refs.deptForm.validate(async valid => {
        if (!valid) return
        try {
          // 0.绑定点击事件
          // 1.兜底校验
          // 2.发送请求
          this.form.pid = this.id
          const res = await addDepartments(this.form)
          // console.log(res)
          // 3.提示信息
          this.$message.success(res.message)
          // 4.关闭dialog
          // 5.更新数据
          this.$emit('success')
        } catch (e) {
          this.$message.error(e.message)
        }
      })
    },
    // 修改信息
    async doEdit() {
      this.$refs.deptForm.validate(async valid => {
        if (!valid) return
        try {
          // 0.绑定点击事件
          // 1.兜底校验
          // 2.发送请求
          const res = await editDepartmentsById(this.form)
          // console.log(res)
          // 3.提示信息
          this.$message.success(res.message)
          // 4.关闭dialog
          // 5.更新数据
          this.$emit('edit')
        } catch (e) {
          this.$message.error(e.message)
        }
      })
    },
    hCancel() {
      this.$emit('close')
    },
    async loadEmployees() {
      try {
        const res = await getEmployeesList()
        // console.log(res)
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
