import request from '@/utils/axios'

function getTreeData(data) {
  return request({
    url: '/wiki-backend/api/categoryContentTemplate/loadTree',
    method: 'post',
    data
  })
}

function getTemplateList(data) {
  return request({
    url: '/wiki-backend/api/categoryContentTemplate/list',
    method: 'post',
    data
  })
}

function saveTemplate(data) {
  return request({
    url: '/wiki-backend/api/categoryContentTemplate/save',
    method: 'post',
    data
  })
}

function updateTemplate(data) {
  return request({
    url: '/wiki-backend/api/categoryContentTemplate/update',
    method: 'post',
    data
  })
}

function deleteTemplate(data) {
  return request({
    url: '/wiki-backend/api/categoryContentTemplate/delete',
    method: 'post',
    data
  })
}

function checkTemplate(data) {
  return request({
    url: '/wiki-backend/api/categoryContentTemplate/info',
    method: 'post',
    data
  })
}

function checkTemplateTreeData(data) {
  return request({
    url: '/wiki-backend/api/categoryContentTemplate/getContentsByCategoryId',
    method: 'post',
    data
  })
}

export default {
  getTreeData,
  getTemplateList,
  saveTemplate,
  updateTemplate,
  deleteTemplate,
  checkTemplate,
  checkTemplateTreeData
}