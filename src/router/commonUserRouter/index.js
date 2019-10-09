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
