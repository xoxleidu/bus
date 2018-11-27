import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',

    children: [{
      path: 'dashboard',
      meta: { title: '车辆监控', icon: 'busjk'},
      component: () => import('@/views/map/index'),

    }]
  },
  {
    path: '/jiankongline',
    component: Layout,
    children: [
      {
        path: 'jiankongline',
        name: '线路监控',
        component: () => import('@/views/mapline/index'),
        meta: { title: '线路监控', icon: 'linejk' }
      }
    ]
  },
  {
    path: '/guiji',
    component: Layout,
    children: [
      {
        path: 'guiji',
        name: '轨迹回放',
        component: () => import('@/views/guiji/index'),
        meta: { title: '轨迹回放', icon: 'guiji' }
      }
    ]
  },
  {
    path: '/xianlu',
    component: Layout,
    children: [
      {
        path: 'xianlu',
        name: '线路演示',
        component: () => import('@/views/xianlu/index'),
        meta: { title: '线路演示', icon: 'lineys' }
      }
    ]
  },
  {
    path: '/xianluedit',
    component: Layout,
    children: [
      {
        path: 'xianluedit',
        name: '线路管理',
        component: () => import('@/views/xianluedit/index'),
        meta: { title: '线路管理', icon: 'xledit' }
      }
    ]
  },
  {
    path: '/list',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/list/index'),
        meta: { title: '驾驶人员管理', icon: 'users' }
      }
    ]
  },
  {
    path: '/bus',
    component: Layout,
    children: [
      {
        path: 'bus',
        name: 'bus',
        component: () => import('@/views/bus/index'),
        meta: { title: '车辆管理', icon: 'bus' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'http://localhost:8080/buscenter/swagger-ui.html#/',
        meta: { title: '接口文档', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
    /*clickLink(path) {
      this.$router.push({
        path,
        query: {
          t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
        }
      })
    },*/
  routes: constantRouterMap
})
