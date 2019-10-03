import request from '@/utils/axios'
//条件分页查询提取任务列表
export function list(data) {
  return request({
    url: '/wiki-backend/api/extractTask/list',
    method: 'post',
    data
  })
}
//新增提取任务
export function save(data) {
  return request({
    url: '/wiki-backend/api/extractTask/save',
    method: 'post',
    data
  })
}

//按ID查询提取任务
export function info(data) {
  return request({
    url: '/wiki-backend/api/extractTask/info',
    method: 'post',
    data
  })
}

//修改提取任务
export function update(data) {
  return request({
    url: '/wiki-backend/api/extractTask/update',
    method: 'post',
    data
  })
}
//删除提取任务
export function deleteTask(data) {
  return request({
    url: '/wiki-backend/api/extractTask/delete',
    method: 'post',
    data
  })
}
//按照任务ID查询任务日志列表
export function extractTaskLog(data) {
  return request({
    url: '/wiki-backend/api/extractTaskLog/list',
    method: 'post',
    data
  })
}
//启动/停止提取任务
export function updateStatus(data) {
  return request({
    url: '/wiki-backend/api/extractTask/updateStatus',
    method: 'post',
    data
  })
}


