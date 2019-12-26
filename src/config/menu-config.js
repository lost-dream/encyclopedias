module.exports = [
  //一级路由
  {
    name: '词条分类维护',
    componentName: 'categoryManage',
    icon: '/static/image/icon/yingyongguanli.png'
  },
  {
    name: '属性模板管理',
    componentName: 'classifyManager',
    icon: '/static/image/icon/Management.png'
  },
  {
    name: '目录模板管理',
    componentName: 'contentTemplate',
    icon: '/static/image/icon/caidanguanli.png'
  },
  {
    name: '词条版本审核',
    componentName: 'entryVersionExamine',
    icon: '/static/image/icon/bianji.png'
  },
  { name: '特色专题管理', componentName: 'specialManager', icon: '/static/image/icon/dangan.png' },

  { name: '提取任务管理', componentName: 'extractTask', icon: '/static/image/icon/tiqurenwu.png' },
  {
    name: '抽取词条审核',
    componentName: 'entryExamine',
    icon: '/static/image/icon/wangluo(2).png'
  },
  {
    name: '数据源管理',
    componentName: 'dataSourceList',
    icon: '/static/image/icon/jigouguanli.png'
  }
  //	{name: '词条创建',componentName: 'createEntry'},
  //	{name: '我的词条',componentName: 'myEntry'},

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
