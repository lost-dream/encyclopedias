import request from '@/utils/axios'
//获取首页词条统计数据
export function entryStatistical(data) {
  return request({
    url: '/wiki-backend/api/index/entryStatistical',
    method: 'post',
    data
  })
}
//获取用户词条列表
export function userEntryList(data) {
  return request({
    url: '/wiki-backend/api/entry/userList',
    method: 'post',
    data
  })
}
//词条列表（搜索、词条分类）
export function entryList(data) {
  return request({
    url: '/wiki-backend/api/entry/list',
    method: 'post',
    data
  })
}

//获取首页最新词条
export function getCarouselList(data) {
  return request({
    url: '/wiki-backend/api/entry/list3',
    method: 'post',
    data
  })
}

// 获取首页分类推荐

export function getRecommendClass(data) {
  return request({
    url: '/wiki-backend/api/category/flTuijian',
    method: 'post',
    data
  })
}

//获取词条详情
export function getEntryDetail(data) {
  return request({
    url: '/wiki-backend/api/entry/list2',
    method: 'post',
    data
  })
}

//词条列表（搜索、词条分类）--全站搜索
export function searchTotalStationEntryList(data) {
  return request({
    url: '/wiki-backend/encyclopedia/search/query',
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
//通过用户ID查询该用户的词条统计数据
export function userStatistics(data) {
  return request({
    url: '/wiki-backend/api/entry/userStatistics',
    method: 'post',
    data
  })
}
