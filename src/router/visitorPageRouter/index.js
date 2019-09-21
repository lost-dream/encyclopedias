import Visitor from '@/visitor'
const visitorRouter = [
  {
	path: '/visitor',
	component: Visitor,
	name: 'visitor',
	meta: {
		title: '游客'
	},
	children: [{
			path: '/carefullyChoseClassify',
			component: () =>
				import('@/views/carefullyChoseClassify/index'),
			name: 'carefullyChoseClassify',
			meta: {
				title: '专题',
			},
		},
		{
			path: '/index',
			component: () =>
				import('@/views/index/index'),
			name: 'index',
			meta: {
				title: '首页',
			},
		},
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
			path: '/searchResultList',
			component: () =>
				import('@/views/searchResultList/index'),
			name: 'searchResultList',
			meta: {
				title: '词条搜索结果列表页',
			},
		},
		{
			path: '/special',
			component: () =>
				import('@/views/special/index'),
			name: 'special',
			meta: {
				title: '专题',
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
export default visitorRouter
