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
              <el-button type="text" @click="hEdit(row.id)">编辑</el-button>
              <el-button type="text" @click="hDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog :visible.sync="showDialog" :title="isEdit?'编辑':'添加'" @closed="hClosed">
      <!-- 表单内容 -->
      <el-form
        ref="form"
        label-width="100px"
        :model="formData"
        :rules="rules"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
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
          <el-button type="primary" @click="hSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, addPermission, delPermission, updatePermission, getPermissionDetail } from '@/api/permissions'
import { tranListToTreeData } from '../../utils'
export default {
  data() {
    // 自定义校验 code name
    const nameValida = (rule, value, callback) => {
      let nameList = null
      if (this.isEdit) {
        nameList = this.originList.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).map(({ name }) => name)
      } else {
        // 添加时校验 不能添加子元素的名字
        nameList = this.originList.filter(item => item.pid === this.formData.pid).map(({ name }) => name)
      }
      if (nameList.includes(value)) {
        callback(new Error(name + value + '已存在'))
      } else {
        callback()
      }
    }
    const codeValida = (rule, value, callback) => {
      let codeList = null
      // 添加时的校验：code不能重复
      if (this.isEdit) {
        // 编辑时的校验: code能取自己
        codeList = this.originList.filter(item => item.id !== this.formData.id).map(({ code }) => code)
      } else {
        codeList = this.originList.map(({ code }) => code)
      }
      if (codeList.includes(value)) {
        callback(new Error(value + '已存在'))
      } else {
        callback()
      }
    }
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
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10位的字符', trigger: 'blur' },
          { validator: nameValida, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10位的字符', trigger: 'blur' },
          { validator: codeValida, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10位的字符', trigger: 'blur' }
          // { validator: nameValida, trigger: 'blur' }
        ]
      },
      isEdit: false,
      originList: []
    }
  },
  created() {
    this.loadPermission()
  },
  methods: {
    async loadPermission() {
      const res = await getPermissionList()
      console.log(res)
      // 筛选所需数据
      this.originList = res.data.map(item => {
        return { id: item.id, code: item.code, name: item.name, pid: item.pid }
      })
      // 转换树状图
      this.permission = tranListToTreeData(res.data)
    },
    hAdd(type, pid) {
      this.isEdit = false
      // console.log(type, pid)
      // 设置表单数据
      this.formData.type = type
      this.formData.pid = pid
      // 打开dialog
      this.showDialog = true
    },
    async hSubmit() {
      let res = null
      // 表单校验
      const valid = await this.$refs.form.validate().catch(e => e)
      if (!valid) return
      if (this.isEdit) {
        res = await updatePermission(this.formData)
      } else {
        res = await addPermission(this.formData)
      }
      try {
        // 发请求
        // 提示用户
        this.$message.success(res.message)
        this.showDialog = false
        // 更新数据渲染
        this.loadPermission()
      } catch (e) {
        this.$message.success(e.message)
      }
    },
    // dialog 清除表单
    hClosed() {
      // 清空表单数据
      this.formData = {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      }
      // 清空表单校验
      // this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
    },
    async hDel(id) {
      // 弹窗提示用户是否确认
      const result = await this.$confirm('确认要删除吗', '提示', { type: 'warning' }).catch(e => e)
      if (result !== 'confirm') return
      try {
        // 发请求
        const res = await delPermission(id)
        // 提示信息
        this.$message.success(res.message)
        // 更新渲染数据
        this.loadPermission()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    async hEdit(id) {
      this.isEdit = true
      try {
        const res = await getPermissionDetail(id)
        // console.log(res)
        // 数据回填
        this.formData = res.data
        this.showDialog = true
        // this.$message.success(res.message)
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>
