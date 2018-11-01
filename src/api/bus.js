import request from '@/utils/request'
import qs from 'qs' // 需要安装qs

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function postList(currentPage,pageSize,queryk,queryv) {
  var data = '';
  if(queryk == 0){

    data = {
      currentPage:currentPage,
      pageSize:pageSize,
      employeeId:queryv
    }

  } else if (queryk == 1) {
    data = {
      currentPage:currentPage,
      pageSize:pageSize,
      idcard:queryv
    }
  } else {
    data = {
      currentPage:currentPage,
      pageSize:pageSize
    }
  }

  return request({
    url: '/buscontroller/findallbus',
    method: 'post',
    data
  })
}

export function createArticle(data) {
  return request({
    url: '/buscontroller/addbus',
    method: 'post',
    data//
  })
}

export function updateArticle(data) {
  return request({
    url: '/buscontroller/updatebus',
    method: 'post',
    data
  })
}

export function deleteArticle(data) {
  return request({
    url: '/buscontroller/deletebuslist',
    method: 'post',
    data:{
      id:data
    }
  })
}
