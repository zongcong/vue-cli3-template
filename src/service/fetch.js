/*
 **axios服务配置文件
 */
import axios from 'axios'
import { Message } from 'element-ui'
import QS from 'qs'
// 创建实例
const service = axios.create({
  // baseURL: config.BASE_API, // 使用代理
  timeout: 30000, // 请求超时时间
  method: 'post'
})

// request拦截器
service.interceptors.request.use(
  config => {
    // removePending(config); //在一个ajax发送前执行一下取消操作
    // config.cancelToken = new cancelToken((c) => {
    //   // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    //   pending.push({
    //     u: config.url + '&' + config.method,
    //     f: c
    //   });
    // });
    if (config.data && config.data instanceof FormData) {
      // 图片上传
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      config.data = QS.stringify(config.data)
    }
    // Do something before request is sent
    config.withCredentials = false
    // 国际化
    // let lang = window.vm.$i18n.locale
    // if (lang) config.headers['Accept-Language'] = lang.toLowerCase()
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error.response)
  }
)

// response拦截器
service.interceptors.response.use(
  response => {
    // removePending(response.config); //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    return response
  },
  error => {
    console.log(error)
    if (error.message.includes('timeout')) {
      // 网络连接超时，请稍后再试
      Message.error('网络连接超时，请稍后再试')
    }
    return Promise.reject(error)
  }
)

// 用一个新的promise再包一层处理抛出的错误
const fetch = function (config) {
  return new Promise((resolve, reject) => {
    service(config)
      .then(response => {
        return checkStatus(response)
      })
      .then(result => {
        // 处理服务器错误
        if (result.err) {
          Message.error(result.message)
          reject(result)
        }
        let res = result.data
        // 60002 10007账号密码错误  10018为第一次登陆  10019未绑定联系方式  90000004已撤单 90000005已售出
        if (
          res.code === '20000' ||
          res.code === '10018' ||
          res.code === '60002' ||
          res.code === '10007' ||
          res.code === '10019' ||
          res.code === '90000004' ||
          res.code === '90000005' ||
          res.code === '90002005'
        ) {
          let resolves = res.code === '20000' ? res.data : res
          resolve(resolves)
        } else {
          // 系统停市
          if (res.code === '90002006') {
            window.vm.$router.push('/maintenance')
            return
          }
          // 登录超时
          if (res.code === '20003') {
            window.vm.$store.dispatch('SetUserInfo', '')
            if (window.vm.$route.path !== '/tradeIndex') {
              // 登录超时，请重新登录
              Message.error('登录超时，请重新登录')
            }
            window.vm.$router.push('/tradeIndex')
            window.vm.$store.dispatch('SetShowLogin', true)
            reject(res)
          } else {
            if (
              res.code === '20007' ||
              res.code === '700005' ||
              res.code === '710001' ||
              res.code === '710002' ||
              res.code === '710003' ||
              res.code === '710005' ||
              res.code === '710006' ||
              res.code === '710008' ||
              res.code === '710011' ||
              res.code === '710012' ||
              res.code === '710013' ||
              res.code === '710015' ||
              res.code === '710016' ||
              res.code === '710020' ||
              res.code === '710023' ||
              res.code === '710025'
            ) {
              // 系统超时请稍后重试
              Message.error('window.vm.$t(\'latest.type4\')')
            } else {
              Message.error(res.msg)
            }
            reject(res)
          }
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 检查请求状态
function checkStatus (response) {
  // 如果http状态码正常，则直接返回数据
  // console.log('checkStatus', response);
  let status = response.status
  if (response && (status === 200 || status === 304)) {
    return response
  }
  // 异常状态下，把错误信息返回去
  if (!response) {
    return {
      // 定义错误信息
      err: true,
      status: -1,
      message: '无法连接服务器，请稍后再试'
    }
  } else {
    return {
      err: true,
      status: status,
      message: `服务器返回出错，状态码：${status}`
    }
  }
}

// 超时签出
// function logout () {
//   MessageBox.confirm('您已被登出，请重新登录！', '提示', {
//     confirmButtonText: '确 定',
//     showCancelButton: false,
//     showClose: false,
//     closeOnClickModal: false,
//     type: 'warning'
//   }).then(() => {
//     window.vm.$router.push('/login');
//   });
// }

export default fetch
