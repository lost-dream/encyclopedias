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


