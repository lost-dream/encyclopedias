import request from '@/utils/axios'
/*
* 获取启动词列表
* */
export function listEntryStartWord(data) {
  return request({
    url: '/wiki-backend/api/sourceEntry/listEntryStartWord',
    method: 'post',
    data
  })
}

/*
* 获取关联词列表
* */
export function listEntryAssWord(data) {
  return request({
    url: '/wiki-backend/api/sourceEntry/listEntryAssWord',
    method: 'post',
    data
  })
}

export default {
  listEntryStartWord
}