import Layout from '@/layout'
const categoryManagerRouter = [
  {
    path: '/layout',
    component: Layout,
    name: 'category',
    meta: {
      title: '分类'
    },
    children: [
      {
        path: '/categoryManage',
        component: () => import('@/views/categoryManage/categoryManage'),
        name: 'categoryManage',
        meta: {
          title: '分类管理',
        }
      },
    ]
  }
]
export default categoryManagerRouter