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
		},{
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
		{
			path: '/viewEntry',
			component: () => import('@/views/entry/viewEntry'),
			name: 'viewEntry',
			meta: {
					title: '词条浏览',
			}
		},
		{
				path: '/createEntry',
				component: () => import('@/views/entry/createEntry'),
				name: 'createEntry',
				meta: {
						title: '词条创建',
				}
		}, {
				path: '/editEntry',
				component: () => import('@/views/entry/editEntry'),
				name: 'editEntry',
				meta: {
						title: '词条编辑',
				},
		}
	]
}

	
]
export default visitorRouter
