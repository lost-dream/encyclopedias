import Layout from '@/layout'
const commonUserRouter = [
  {
	path: '/commonUser',
	component: Layout,
	name: 'commonUser',
	meta: {
		title: '普通用户'
	},
	children: [
		{
			path: '/myEntry',
			component: () =>
				import('@/views/myEntry/index'),
			name: 'myEntry',
			meta: {
				title: '我的词条',
			},
		},
		{
			path: '/versionHistory',
			component: () =>
				import('@/views/versionHistory/index'),
			name: 'versionHistory',
			meta: {
				title: '历史版本',
			},
		},
		{
			path: '/versionHistoryDetail',
			component: () =>
				import('@/views/versionHistory/detail'),
			name: 'versionHistoryDetail',
			meta: {
				title: '版本详情',
			},
		},

	]
}

	
]
export default commonUserRouter
