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
			path: '/entryVersionList',
			component: () =>
				import('@/views/versionHistory/index'),
			name: 'entryVersionList',
			meta: {
				title: '历史版本',
			},
		},
		{
			path: '/entryVersionDetail',
			component: () =>
				import('@/views/versionHistory/detail'),
			name: 'entryVersionDetail',
			meta: {
				title: '版本详情',
			},
		},

	]
}

	
]
export default commonUserRouter
