import request from '@/utils/axios'

export function categoryAttributeTemplate(data) {
  return request({
    url: '/wiki-backend/api/categoryAttributeTemplate/list',
    method: 'post',
    data
  })
}
