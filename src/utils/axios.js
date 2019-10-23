import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
baseURL: 'http://106.12.208.84:8080', // url = base url + request url
//baseURL: 'http://localhost:8080',
//baseURL: 'http://192.168.0.35:8080',
//baseURL: 'http://10.24.1.21:8080',
  withCredentials: false, // send cookies when cross-domain requests
  crossDomain: true,
  timeout: 1000*60*2, // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
//  var token = sessionStorage.getItem('token')
//  if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
//    config.headers['token'] = token
//  }
    config.headers['Authorization'] = sessionStorage.getItem('token')
//  if(!sessionStorage.getItem('token')){
//  	Message({
//	      message: '您尚未登录！',
//	      type: 'error',
//	      duration: 2000
//	    })
//  }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom status is not true, it is judged as an error.
    if (res.status === 'fail') {
      Message({
        message: res.msg || 'error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res.message || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '请求错误，请稍后重试',
      type: 'error',
      duration: 2000
    })
    return Promise.reject(error)
  }
)

export default service