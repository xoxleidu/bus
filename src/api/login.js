import request from '@/utils/request'
import qs from 'qs' // 需要安装qs

export function login(username, password) {
  /*var jsonData = {username,
    password}

    alert(JSON.stringify(jsonData))*/
  return request({
    //baseURL:'http://localhost:8070',
    url: '/user/login',
    method: 'post',
    /*headers:{
      'Content-Type': 'application/json',
      'charset':'UTF-8'
    },*/
    //contenttype:'application/json;charset=UTF-8',
    /*headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },*/
    data:{
      username,
      password
    },
  /*transformRequest: [function (data) {
    return qs.stringify(data);
  }],*/

  })
}

export function getInfo(token) {
  return request({
    //baseURL:'http://localhost:8070',
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
