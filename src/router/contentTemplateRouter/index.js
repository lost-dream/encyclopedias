import Layout from '@/layout'
const contentTemplateRouter = [
  {
    path: '/layout',
    component: Layout,
    name: 'categoryTemplate',
    meta: {
      title: '分类模板'
    },
    children: [
      {
        path: '/contentTemplate',
        component: () => import('@/views/contentTemplate/contentTemplate'),
        name: 'contentTemplate',
        meta: {
          title: '分类模板',
        }
      },
    ]
  }
]
export default contentTemplateRouter