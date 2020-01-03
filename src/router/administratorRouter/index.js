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
		{
			path: '/reptileData',
			component: () => import('@/views/reptileData/reptileData'),
			name: 'reptileData',
			meta: {
				title: '信息百科 - 爬虫数据管理',
			},
		},
		{
			path: '/entryVersionExamine',
			component: () => import('@/views/entryVersionExamine/entryVersionExamine'),
			name: 'entryVersionExamine',
			meta: {
				title: '信息百科 - 词条版本审核',
			},
		},
		{
			path: '/entryExamine',
			component: () => import('@/views/entryExamine/entryExamine'),
			name: 'entryExamine',
			meta: {
				title: '信息百科 - 抽取词条审核',
			},
		},
		{
			path: '/extractTask',
			component: () => import('@/views/extractTask/extractTask'),
			name: 'extractTask',
			meta: {
				title: '信息百科 - 提取任务列表',
			},
		},
		{
			path: '/extractTaskManager',
			component: () => import('@/views/extractTask/extractTaskManager'),
			name: 'extractTaskManager',
			meta: {
				title: '信息百科 - 提取任务管理',
			},
		},
		{
			path: '/extractTaskLog',
			component: () => import('@/views/extractTask/extractTaskLog'),
			name: 'extractTaskLog',
			meta: {
				title: '信息百科 - 提取日志',
			},
		}
		,{
            path: '/specialManager',
            component: () => import('@/views/specialManager/index'),
            name: 'specialManager',
            meta: {
                title: '专题管理',
            },
        },
        {
            path: '/specialDetail',
            component: () => import('@/views/specialManager/specialDetail'),
            name: 'specialDetail',
            meta: {
                title: '专题详情',
            }
        }
		
		
		
	]
}

	
]
export default administratorRouter
