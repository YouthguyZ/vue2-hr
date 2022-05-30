import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [{
    path: '', // 作为默认渲染路由
    name: 'employees',
    component: () => import('@/views/employees/employees.vue'),
    meta: { title: '员工', icon: 'people' }
  }]
}
