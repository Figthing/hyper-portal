import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import i18n from '@/lang'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 8000
})

// request interceptor
service.interceptors.request.use(
  config => {

    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }

    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {

    let code = response.data.code
    response.data.success = true

    if (code != 0) {
      Notification.error({
        title: i18n.t('apiErrorCode.errorCode_'+code),
        duration: 2500
      })

      response.data.success = false
    }

    return response
  },
  error => {
    let code = 0
    let dataCode = {}

    if (undefined != error.response.data) {
      dataCode = error.response.data.code;
    }

    try {
      code = error.response.status
    } catch (e) {

      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 2500
        })
        return Promise.reject(error)
      }

      if (error.toString().indexOf('Error: Network Error') !== -1) {
        Notification.error({
          title: '网络请求错误',
          duration: 2500
        })
        return Promise.reject(error)
      }
    }

    if (code === 504) {
      Notification.error({
        title: '服务器异常',
        duration: 2500
      })
      return Promise.reject(error)
    }

    if (code === 401) {

      if (dataCode == '200') {
        Notification.error({
          title: '用户不存在！',
          duration: 2500
        })
        return;
      }

      if (dataCode == '201') {
        Notification.error({
          title: '账号密码错误！',
          duration: 2500
        })
        return;
      }

      if (dataCode == '203') {
        Notification.error({
          title: '账号已被锁定！',
          duration: 2500
        })
        return;
      }


      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else {
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 2500
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
