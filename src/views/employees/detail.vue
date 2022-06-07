<template>
  <div class="employees-container">
    <div class="app-container">
      {{ $route.query.id }}
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置" />
          <el-tab-pane label="个人详情" />
          <el-tab-pane label="岗位信息" />
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
