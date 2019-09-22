import request from '@/utils/axios'

function getTreeData(data) {
  return request({
    url: '/wiki-backend/api/category/loadTree',
    method: 'post',
    data
  })
}

function getCategoryList(data) {
  return request({
    url: '/wiki-backend/api/category/list',
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

function checkCategory(data) {
  return request({
    url: '/wiki-backend/api/category/info',
    method: 'post',
    data
  })
}

export default {
  getTreeData,
  getCategoryList,
  updateCategory,
  createCategory,
  deleteCategory,
  checkCategory
}