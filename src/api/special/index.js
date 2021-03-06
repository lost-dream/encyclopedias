import request from '@/utils/axios'
//获取专题列表
export function specialList(data) {
  return request({
    url: '/wiki-backend/api/special/list',
    method: 'post',
    data
  })
}
//删除专题
export function deleteSpecial(data) {
  return request({
    url: '/wiki-backend/api/special/delete',
    method: 'post',
    data
  })
}
//通过ID获取查询专题
export function specialInfo(data) {
  return request({
    url: '/wiki-backend/api/special/info',
    method: 'post',
    data
  })
}
//新增专题接口
export function specialSave(data) {
  return request({
    url: '/wiki-backend/api/special/save',
    method: 'post',
    data
  })
}
//按照专题ID获取专题词条列表
export function specialEntryList(data) {
  return request({
    url: '/wiki-backend/api/entry/specialList',
    method: 'post',
    data
  })
}
