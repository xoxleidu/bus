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
    url: '/drivermange/findDriverInfoByPage',
    method: 'post',
    data
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

export function deleteArticle(data) {
  return request({
    url: '/drivermange/forbideDriverInfos',
    method: 'post',
    data:{
      id:data
    }
  })
}

export function getBusLineList() {
  return request({
    url: '/line/findAllLineInfo',
    method: 'post'

  })
}

export function getBusList(data) {
  return request({
    url: 'http://192.168.88.40:8080/buscenter/busInfo/findOnlineBusListInLine',
    method: 'post',
    data:{
      runMethod:data
    }
  })
}

export function getBusGPS(data) {
  return request({
    url: 'http://192.168.88.40:8080/buscenter/line/findLinedetailInfo',
    method: 'post',
    data:{
      runMethod:data
    }
  })
}

