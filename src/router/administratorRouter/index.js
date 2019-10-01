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
		},
		{
			path: '/dataSourceManager',
			component: () => import('@/views/dataSourceManager/dataSourceManager'),
			name: 'dataSourceManager',
			meta: {
				title: '信息百科 - 数据源管理',
			},
		},
		{
			path: '/dataSourceList',
			component: () => import('@/views/dataSourceManager/dataSourceList'),
			name: 'dataSourceList',
			meta: {
				title: '信息百科 - 数据源列表',
			},
		},
		
	]
}

	
]
export default administratorRouter
