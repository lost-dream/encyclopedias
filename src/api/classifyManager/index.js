import request from '@/utils/axios'
//获取分类树状数据
export function categoryTree(data) {
  return request({
    url: '/wiki-backend/api/category/loadTree',
    method: 'post',
    data
  })
}

// 获取内部词条
export function getInternalEntryList(data) {
  return request({
    url: '/wiki-backend/api/category/loadTreeInner',
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
    url: '/wiki-backend/api/categoryAttributeTemplate/delete',
    method: 'post',
    data
  })
}
//通过分类ID获取属性模板数据（包含分类父级）
export function getAllAttributesByCategoryId(data) {
  return request({
    url: '/wiki-backend/api/categoryAttributeTemplate/getAttributesByCategoryId',
    method: 'post',
    data
  })
}
