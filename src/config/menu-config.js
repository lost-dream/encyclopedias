module.exports = [
	//一级路由
	{name: '属性模板管理',componentName: 'classifyManager'},
	
	
	
	
	
	
	//二级路由
	{
		name: 'Form',
		id: 'form',
		sub: [
			{name: 'Radio 单选框',componentName: 'FormRadio'},
			{name: 'Checkbox 多选框',componentName: 'FormCheckbox'}
		]
	}
]
