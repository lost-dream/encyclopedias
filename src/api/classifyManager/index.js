import request from '@/utils/axios'
//获取分类树状数据
export function categoryTree(data) {
  return request({
    url: '/wiki-backend/api/category/loadTree',
    method: 'post',
    data
  })
}
//获取模板数据列表
export function list(data) {
  return request({
    url: '/wiki-backend/api/categoryAttributeTemplate/list',
    method: 'post',
    data
  })
}
//新增/更新分类属性模板
export function save(data) {
  return request({
    url: '/wiki-backend/api/categoryAttributeTemplate/save',
    method: 'post',
    data
  })
}
//通过ID查询分类模板详细---
export function info111(data) {
  return request({
    url: '/wiki-backend/api/categoryAttributeTemplate/info111',
    method: 'post',
    data
  })
}
//通过ID查询分类模板详细
export function info(data) {
  return request({
    url: '/wiki-backend/api/categoryAttributeTemplate/info',
    method: 'post',
    data
  })
}
//通过ID删除对应的模板
export function attrDelete(data) {
  return request({
    url: 'wiki-backend/api/categoryAttributeTemplate/delete',
    method: 'post',
    data
  })
}