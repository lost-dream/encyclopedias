import request from '@/utils/axios'

function getTreeData(data) {
  return request({
    url: '/wiki-backend/api/category/loadTree',
    method: 'post',
    data
  })
}

function updateCategory(data) {
  return request({
    url: '/wiki-backend/api/category/update',
    method: 'post',
    data
  })
}

function createCategory(data) {
  return request({
    url: '/wiki-backend/api/category/save',
    method: 'post',
    data
  })
}

function deleteCategory(data) {
  return request({
    url: '/wiki-backend/api/category/delete',
    method: 'post',
    data
  })
}

export default {
  getTreeData,
  updateCategory,
  createCategory,
  deleteCategory
}