import request from '@/utils/axios'
//获取首页词条统计数据
export function entryStatistical(data) {
  return request({
    url: '/wiki-backend/api/index/entryStatistical',
    method: 'post',
    data
  })
}
