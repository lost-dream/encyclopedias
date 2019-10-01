import request from '@/utils/axios'
//新增数据源
export function save(data) {
  return request({
    url: '/wiki-backend/api/dataSource/save',
    method: 'post',
    data
  })
}
//按照数据源类型查询数据源列表
export function list(data) {
  return request({
    url: '/wiki-backend/api/dataSource/list',
    method: 'post',
    data
  })
}

//查询数据源详情
export function info(data) {
  return request({
    url: '/wiki-backend/api/dataSource/info',
    method: 'post',
    data
  })
}

//修改数据源
export function update(data) {
  return request({
    url: '/wiki-backend/api/dataSource/update',
    method: 'post',
    data
  })
}
//删除数据源
export function deleteSource(data) {
  return request({
    url: '/wiki-backend/api/dataSource/delete',
    method: 'post',
    data
  })
}
