import Layout from '@/layout'
export default {
  path: '/approvals',
  component: Layout,
  children: [{
    path: '', // 作为默认渲染路由
    name: 'approvals',
    component: () => import('@/views/approvals/approvals.vue'),
    // 体验svg适量图标
    // meta: { title: '审批', icon: 'cai' }
    meta: { title: '审批', icon: 'tree-table' }
    // icon:'tree-table'
  }]
}
