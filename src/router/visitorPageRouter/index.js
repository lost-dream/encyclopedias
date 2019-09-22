import Visitor from '@/visitor'
const visitorRouter = [
	{path: '/', redirect: 'index'},//默认进入首页
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
			path: '/entryListByCategory',
			component: () =>
				import('@/views/entryListByCategory/index'),
			name: 'entryListByCategory',
			meta: {
				title: '精选分类',
			},
		},
	]
}

	
]
export default visitorRouter
