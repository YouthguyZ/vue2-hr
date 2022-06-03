<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <!-- <svg-icon icon-class="cai" />svg图标 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <!-- '': 一级部门的pid都是'' -->
                    <el-dropdown-item @click.native="hAddShow('')">添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- highlight-current当前高亮 -->
        <el-tree
          :data="list"
          default-expand-all
        >
          <!-- 作用域插槽 data拿到的是每一个子节点的对象 -->
          <!--
      #default === slot-scope
      什么时候用到作用域插槽？父组件中如果想使用子组件中的数据进行自定义内容的渲染 (类似于table 单元格数据渲染)
    -->
          <template v-slot:default="{data}">
            <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width:100%;">
              <el-col :span="20">
                <span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager }}</el-col>
                  <!-- 下拉菜单 element -->
                  <el-col>
                    <el-dropdown>
                      <span>
                        操作<i class="el-icon-arrow-down" />
                      </span>
                      <!-- v-if="data.children.length===0" 当有子部门时删除部门下拉框不显示 优化删除功能 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="hAddShow(data.id)">添加子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="hEditShow(data.id)">编辑部门</el-dropdown-item>
                        <el-dropdown-item v-if="data.children.length===0" @click.native="hDelShow(data.id)">删除部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 根据isEdit不同的boolean值，决定显示不同的标题： 添加和编辑。 -->
    <el-dialog
      :title="isEdit? '编辑部门':'添加子部门'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showVisible"
      width="55%"
    >
      <!-- 注册使用子组件  -->
      <add-or-edit v-if="showVisible" :id="curId" :origin-list="originList" :is-edit="isEdit" @close="hCancel" @success="hSuccess" />
    </el-dialog>

    <!-- 根据isEdit不同的boolean值，决定显示不同的标题： 添加和编辑。 -->
    <el-dialog
      :title="isEdit?'编辑部门':'添加子部门'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showVisibleEdit"
      width="55%"
    >
      <!-- 在关闭弹层时，把**子组件销毁**，再次打开时，重新创建(created再走一遍)，就重发请求 -->
      <add-or-edit v-if="showVisibleEdit" :id="curId" :origin-list="originList" :is-edit="isEdit" @close="hCancel" @edit="hEdit" />
    </el-dialog>
  </div>
</template>
<script>
import { getDepartmentsList, deleteDepartmentsById } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
// 导入子组件 装表单内容
import addOrEdit from '@/views/departments/deptdialog.vue'
export default {
  components: {
    addOrEdit
  },
  data() {
    return {
      // 依赖一份树形数据
      // list: [{
      //   name: '财务部',
      //   manager: '刘备',
      //   children: [
      //     {
      //       name: '财务核算部',
      //       manager: '张飞'
      //     },
      //     {
      //       name: '税务核算部',
      //       manager: '关羽'
      //     }
      //   ]
      // }]
      list: [],
      showVisible: false,
      curId: '',
      isEdit: false,
      showVisibleEdit: false,
      originList: []
    }
  },
  created() {
    this.loadDepartmentsList()
  },
  methods: {
    async loadDepartmentsList() {
      try {
        const res = await getDepartmentsList()
        // console.log(res.data.depts)
        res.data.depts.shift()
        // 筛选源数组
        this.originList = res.data.depts.map(item => {
          return { id: item.id, code: item.code, pid: item.pid, name: item.name }
        })
        // this.list = res.data.depts
        // 用工具函数 扁平数组转换为树状数组
        this.list = tranListToTreeData(res.data.depts)
      } catch (e) {
        console.log(e)
      }
    },
    hAddShow(id) {
      this.showVisible = true
      this.curId = id
      this.isEdit = false
    },
    // 子向父传值 自定义方法
    hSuccess() {
      // 关闭dialog
      this.showVisible = false
      // 更新数据
      this.loadDepartmentsList()
    },
    hEdit() {
      this.showVisibleEdit = false
      this.loadDepartmentsList()
    },
    hEditShow(id) {
      this.showVisibleEdit = true
      this.curId = id
      this.isEdit = true
    },
    hDelShow(id) {
      this.$confirm('确定要删除吗？', '提示', { type: 'warning' })
        .then(() => {
          this.doDel(id)
        })
        .catch((e) => {})
    },
    async doDel(id) {
      try {
        // 1.发请求
        const res = await deleteDepartmentsById(id)
        console.log(res)
        // 2.提示用户
        this.$message.success(res.message)
        // 3渲染数据信息
        this.loadDepartmentsList()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    hCancel() {
      this.showVisible = false
      this.showVisibleEdit = false
    }
  }
}
</script>
