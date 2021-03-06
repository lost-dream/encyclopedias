import request from '@/utils/axios'
//获取词条历史版本
export function entryVersionList(data) {
  return request({
    url: '/wiki-backend/api/entryVersion/list',
    method: 'post',
    data
  })
}
//删除某词条下的某版本（如果版本审核通过则无法删除）
export function deleteEntry(data) {
  return request({
    url: '/wiki-backend/api/entry/delete',
    method: 'post',
    data
  })
}
//根据词条ID获取词条信息
export function entryInfo(data) {
  return request({
    url: '/wiki-backend/api/entry/info',
    method: 'post',
    data
  })
}
//获取审核数据
export function auditList(data) {
  return request({
    url: '/wiki-backend/api/entry/auditList',
    method: 'post',
    data
  })
}
//查询全部抽取词条审核列表
export function auditTaskList(data) {
  return request({
    url: '/wiki-backend/api/entry/auditTaskList',
    method: 'post',
    data
  })
}
//审核
export function audit(data) {
  return request({
    url: '/wiki-backend/api/entry/audit',
    method: 'post',
    data
  })
}


