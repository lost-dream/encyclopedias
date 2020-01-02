| 接口名 | 请求方式 | 请求地址 | 参数 |
|:---:|:---:|:---:| :---: |
| 首页轮播 9 条 | post | localhost:8080/wiki-backend/api/entry/list3 |  |
| 首页--内部词条 | get | localhost:8080/wiki-backend/api/category/loadTreeInner |  |
| 首页--分类查询和分类推荐查询 | post | localhost:8080/wiki-backend/api/entry/list2 | { pageNumber: 1, pageSize: 50, categoryIds: 4 } |
| 登录 | post | localhost:8080/wiki-backend/api/login2 | { Authorization: 'xxssssxx' } |
| 获取菜单结构 | post | localhost:8080/wiki-backend/api/getTheMenuTree | { Authorization: 'xxssssxx' }