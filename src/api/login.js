import request from '@/utils/request'
import qs from 'qs' // 需要安装qs

export function login(userName, passWord) {

  return request({
    url: '/user/login',
    method: 'post',
    data: {
      userName,
      passWord
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
