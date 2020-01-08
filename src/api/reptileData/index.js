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

/*
 * 获取关联词列表
 * */
export function registrySourceEntryWords(data) {
  return request({
    url: '/wiki-backend/api/sourceEntry/registrySourceEntryWords',
    method: 'post',
    data
  })
}

/*
 * 获取爬虫任务管理列表
 * */
export function taskList(data) {
  return request({
    url: '/wiki-backend/api/backendTask/taskList',
    method: 'post',
    data
  })
}
/*
 * 重新抓取
 * */
export function reCrawl(data) {
  return request({
    url: '/wiki-backend/api/backendTask/reCrawl?taskId=' + data,
    method: 'get',
    data
  })
}
export default {
  listEntryStartWord,
  listEntryAssWord,
  taskList,
  registrySourceEntryWords,
  reCrawl
}
