import Layout from '@/layout'
const classifyManagerRouter = [
  {
	path: '/layout',
	component: Layout,
	name: 'classify',
	meta: {
		title: '属性模板'
	},
	children: [{
			path: '/classifyManager',
			component: () =>
				import('@/views/classifyManage/classifyManage'),
			name: 'classifyManager',
			meta: {
				title: '属性模板管理',
			},
		},

	]
}

	
]
export default classifyManagerRouter
