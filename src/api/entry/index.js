import request from '@/utils/axios'
//获取词条历史版本
export function entryVersionList(data) {
  return request({
    url: '/wiki-backend/api/entryVersion/list',
    method: 'post',
    data
  })
}




