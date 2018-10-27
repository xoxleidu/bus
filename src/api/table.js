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
