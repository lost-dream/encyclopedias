module.exports = [
	//一级路由
	{name: '分类模板管理',componentName: 'categoryManage'},
	{name: '属性模板管理',componentName: 'classifyManager'},
	{name: '目录模板管理',componentName: ''},
	{name: '词条创建',componentName: 'createEntry'},
	{name: '词条版本审核',componentName: ''},
	{name: '专题管理',componentName: ''},
	{name: '我的词条',componentName: 'myEntry'},
	{
		name: '数据源',
		id: 'form',
		sub: [
			{name: '数据源管理',componentName: 'dataSourceManager'},
			{name: '数据源列表',componentName: 'dataSourceList'}
		]
	},
	
	
	//二级路由
//	{
//		name: '分类维护',
//		id: 'form',
//		sub: [
//			{name: '子路由1',componentName: 'classifyManager1'},
//			{name: '子路由2',componentName: 'classifyManager2'}
//		]
//	}
]
