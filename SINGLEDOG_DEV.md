---
title: 赵晨敏开发日志
---

## 新增接口（2020/1/5）

| 接口名 | 请求方式 | 请求地址 | 参数 |
|:---:|:---:|:---:| :---: |
| 首页轮播 9 条 | post | localhost:8080/wiki-backend/api/entry/list3 |  |
| 首页--内部词条 | get | localhost:8080/wiki-backend/api/category/loadTreeInner |  |
| 首页--分类查询和分类推荐查询 | post | localhost:8080/wiki-backend/api/entry/list2 | { pageNumber: 1, pageSize: 50, categoryIds: 4 } |
| 登录 | post | localhost:8080/wiki-backend/api/login2 | { Authorization: 'xxssssxx' } |
| 获取菜单结构 | post | localhost:8080/wiki-backend/api/getTheMenuTree | { Authorization: 'xxssssxx' }

### 2020/1/6

- [ ] 创建词条要加上内部外部词条选择
- [x] 词条分类维护增加内部外部词条选择
- [x] 属性模板管理增加内部外部词条选择
- [x] 目录模板管理增加内部外部词条选择
- [x] 特色专题管理
- [x] 特色专题管理 -- 查看详情没有调用接口，不显示数据[^1]

[^1]: 没有专题封面和词条类别的字段，需要添加（前后端字段最好保持一致)

### 2020/1/7

- [ ] 词条分类维护 -- 选择分类之后，再次点击新增分类，上级目录显示的目录树会生成双份
- [x] 首页最新词条共九个，每组三个，共三组，实际出现了 6 组
- [x] 首页分类推荐 tab 切换没有使用 server 返回的 id
