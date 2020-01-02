import request from '@/utils/axios'

//用户登录
export function userLogin(data) {
  return request({
    url: '/wiki-backend/api/login2',
    method: 'post',
    data
  })
}

export function getMenuTree(data) {
  return request({
    url: '/wiki-backend/api/getTheMenuTree',
    method: 'post',
    data
  })
}
