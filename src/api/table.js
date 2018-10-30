import request from '@/utils/request'
import qs from 'qs' // 需要安装qs

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function postList(currentPage,pageSize) {
  return request({
    //baseURL:'http://localhost:8080/buscenter',
    url: '/drivermange/findDriverInfoByPage',
    method: 'post',
    //data
    data:{
      currentPage,
      pageSize
    },
  })
}

export function createArticle(data) {
  return request({
    url: '/drivermange/saveDriverInfo',
    method: 'post',
    data//
  })
}

export function updateArticle(data) {
  return request({
    url: '/drivermange/updateDriverInfo',
    method: 'post',
    data
  })
}
