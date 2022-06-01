<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <svg-icon icon-class="cai" /><span>江苏传智播客教育科技股份有限公司</span>
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
                    <el-dropdown-item @click.native="hAddShow">添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-tree
          :data="list"
          default-expand-all
          highlight-current
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
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="hAddShow(data)">添加子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="hEditShow(data)">编辑部门</el-dropdown-item>
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
    <el-dialog
      title="添加子部门"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showVisible"
      width="55%"
    >
      <add-or-edit v-if="showVisible" :id="curId" :is-edit="isEdit" @success="hSuccess" />
    </el-dialog>
    <el-dialog
      title="编辑部门"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showVisibleEdit"
      width="55%"
    >
      <add-or-edit v-if="showVisibleEdit" :id="curId" :is-edit="isEdit" @edit="hEdit" />
    </el-dialog>
  </div>
</template>
<script>
import { getDepartmentsList } from '@/api/departments'
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
      showVisibleEdit: false
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
        // this.list = res.data.depts
        // 用工具函数 扁平数组转换为树状数组
        this.list = tranListToTreeData(res.data.depts)
      } catch (e) {
        console.log(e)
      }
    },
    hAddShow(data) {
      this.showVisible = true
      this.curId = data.id
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
    hEditShow(data) {
      this.showVisibleEdit = true
      this.curId = data.id
      this.isEdit = true
    }
  }
}
</script>
