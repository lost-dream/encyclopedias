const categoryManagerRouter = [
	{
    path: '/categoryManage',
    component: () => import('@/views/categoryManage/categoryManage'),
    name: 'categoryManage',
    meta: {
      title: '分类管理',
    },
	},
	
]
export default categoryManagerRouter