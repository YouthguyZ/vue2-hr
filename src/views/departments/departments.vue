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
                    <el-dropdown-item>添加子部门</el-dropdown-item>
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
                        <el-dropdown-item>添加子部门</el-dropdown-item>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 依赖一份树形数据
      list: [{
        name: '财务部',
        manager: '刘备',
        children: [
          {
            name: '财务核算部',
            manager: '张飞'
          },
          {
            name: '税务核算部',
            manager: '关羽'
          }
        ]
      }]
    }
  }
}
</script>
