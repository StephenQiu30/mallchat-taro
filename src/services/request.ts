import JSONBig from 'json-bigint'
import Taro from '@tarojs/taro'
import { store } from '@/store'
import { logoutAction } from '@/store/slices/userSlice'
import { removeToken, removeUserInfo } from '@/utils/auth'

const JSONBigStr = JSONBig({ storeAsString: true })
export const baseURL = process.env.TARO_APP_API_BASE_URL || 'http://localhost:8080/api'

/**
 * 基础请求封装 (简化版)
 */
export const request = <T>(url: string, config: any = {}): Promise<T> => {
  return new Promise((resolve, reject) => {
    const token = Taro.getStorageSync('token')
    
    // 处理完整 URL
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`

    Taro.request({
      url: fullUrl,
      method: config.method || 'GET',
      // Taro 会自动 handle GET 的 data (转为 query) 和 POST 的 data (转为 JSON)
      data: config.data || config.params,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...config.headers,
      },
      dataType: 'text', // 为支持 BIGINT
      success: (res) => {
        let data: any
        try {
          data = typeof res.data === 'string' ? JSONBigStr.parse(res.data) : res.data
        } catch (e) {
          data = res.data
        }

        // 处理未登录 (HTTP 401 或 业务 40100)
        if (res.statusCode === 401 || (data && data.code === 40100)) {
          // 清除持久化存储
          removeToken()
          removeUserInfo()
          // 同步清除 Redux 状态
          store.dispatch(logoutAction())
          
          if (!url.includes('/user/login/ma')) {
            Taro.showToast({ title: '登录已失效，请重新登录', icon: 'none' })
          }
          return reject(data)
        }

        // 处理业务异常
        if (data && data.code !== 0) {
          Taro.showToast({ title: data.message || '请求错误', icon: 'none' })
          return reject(data)
        }

        resolve(data)
      },
      fail: (err) => {
        Taro.showToast({ title: '网络连接异常', icon: 'none' })
        reject(err)
      }
    })
  })
}

export default request
