module.exports = [
	//一级路由
	{name: '属性模板管理',componentName: 'classifyManager'},
	
	
	
	
	
	
	//二级路由
	{
		name: '多级路由',
		id: 'form',
		sub: [
			{name: '子路由1',componentName: 'classifyManager1'},
			{name: '子路由2',componentName: 'classifyManager2'}
		]
	}
]
