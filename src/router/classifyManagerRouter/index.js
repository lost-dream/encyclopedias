
const classifyManagerRouter = [
	{
	  path: '/classifyManager',
	  component: () => import('@/views/classifyManage/classifyManage'),
	  name: 'classifyManager',
	  meta: {
	    title: '属性模板管理',
	  },
	},
	
]
export default classifyManagerRouter
