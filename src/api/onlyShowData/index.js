import request from '@/utils/axios'
//获取首页词条统计数据
export function entryStatistical(data) {
  return request({
    url: '/wiki-backend/api/index/entryStatistical',
    method: 'post',
    data
  })
}
//获取用户词条列表
export function userEntryList(data) {
  return request({
    url: '/wiki-backend/api/entry/userList',
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