| 接口名 | 请求方式 | 请求地址 | 参数 |
|:---:|:---:|:---:| :---: |
| 首页轮播 9 条 | post | localhost:8080/wiki-backend/api/entry/list3 |  |
| 首页--内部词条 | get | localhost:8080/wiki-backend/api/category/loadTreeInner |  |
| 首页--分类查询和分类推荐查询 | post | localhost:8080/wiki-backend/api/entry/list2 | { pageNumber: 1, pageSize: 50, categoryIds: 4 } |
| 登录 | post | localhost:8080/wiki-backend/api/login2 | { Authorization: 'xxssssxx' } |
| 获取菜单结构 | post | localhost:8080/wiki-backend/api/getTheMenuTree | { Authorization: 'xxssssxx' }

## dev

### 2020/1/6

- [ ] 创建词条要加上内部外部词条选择
- [x] 词条分类维护增加内部外部词条选择
- [x] 属性模板管理增加内部外部词条选择
- [x] 目录模板管理增加内部外部词条选择
- [x] 特色专题管理
- [ ] 特色专题管理 -- 查看详情没有调用接口，不显示数据[^1]


## problem

element-ui 穿梭框怎么处理选中超过 5 个，只选中前五个后面的不会自动填充







[^1]: 没有专题封面和词条类别的字段，需要添加（前后端字段最好保持一致)
