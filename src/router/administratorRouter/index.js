import Layout from '@/layout'
const administratorRouter = [
  {
	path: '/administrator',
	component: Layout,
	name: 'administrator',
	meta: {
		title: '信息百科 - 管理后台'
	},
	children: [
		{
			path: '/categoryManage',
			component: () => import('@/views/categoryManage/categoryManage'),
			name: 'categoryManage',
			meta: {
				title: '信息百科 - 分类管理',
			}
		},
		{
			path: '/contentTemplate',
			component: () => import('@/views/contentTemplate/contentTemplate'),
			name: 'contentTemplate',
			meta: {
				title: '信息百科 - 目录模板',
			}
		},
		{
			path: '/classifyManager',
			component: () => import('@/views/classifyManage/classifyManage'),
			name: 'classifyManager',
			meta: {
				title: '信息百科 - 属性模板管理',
			},
		}
	]
}

	
]
export default administratorRouter
