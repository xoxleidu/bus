import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function postList(params) {
  alert(52)
  return request({
    url: '/table/list',
    method: 'post',
    params
  })
}

export function createArticle(data) {
  return request({
    baseURL: 'http://localhost:9528/',
    url: '/login',
    method: 'get',
    data//
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
