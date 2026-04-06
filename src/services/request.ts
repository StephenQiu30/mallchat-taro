import axios, { AxiosRequestConfig } from 'axios'
import { TaroAdapter } from 'axios-taro-adapter'
import JSONBig from 'json-bigint'
import Taro from '@tarojs/taro'

const JSONBigStr = JSONBig({ storeAsString: true })

export type RequestType = 'form'

export type RequestConfig = AxiosRequestConfig & {
  requestType?: RequestType
}

/**
 * 获取基础 URL
 */
const baseURL = process.env.TARO_APP_API_BASE_URL || 'http://localhost:8080/api'

/**
 * 创建 Axios 实例
 */
const axiosInstance = axios.create({
  baseURL,
  timeout: 60000,
  adapter: TaroAdapter as any,
  transformResponse: [
    (data) => {
      try {
        // 关键：处理分布式 ID 的大数精度问题
        return JSONBigStr.parse(data)
      } catch (err) {
        return data
      }
    },
  ],
})

/**
 * 请求拦截器
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // 基础 Header 设置
    config.headers.set('Accept', 'application/json')

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    }

    // 处理表单提交
    if ((config as RequestConfig).requestType === 'form') {
      config.headers.set('Content-Type', 'multipart/form-data')
    }

    // 注入 Token
    try {
      const token = Taro.getStorageSync('token')
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
    } catch (e) {
      // 忽略存储访问异常
    }

    return config
  },
  (error) => Promise.reject(error)
)

/**
 * 响应拦截器
 */
axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response

    // MVP 核心逻辑：判定业务状态码
    // 假设 0 为成功，非 0 则视为业务异常
    if (data && data.code !== 0) {
      const message = data.message || '业务执行错误'
      
      Taro.showToast({
        title: message,
        icon: 'none',
        duration: 3000
      })

      // 401/403 特殊状态处理
      if (data.code === 40100 || data.code === 40300) {
        Taro.removeStorageSync('token')
        // 可根据项目需求在此处执行跳转登录页
      }

      return Promise.reject(data)
    }

    return data
  },
  (error) => {
    const { response } = error
    
    // 处理 HTTP 协议层级的错误 (非 2xx)
    const message = response?.data?.message || error.message || '网络连接异常'
    
    Taro.showToast({
      title: message,
      icon: 'none',
      duration: 3000
    })

    if (response?.status === 401 || response?.status === 403) {
      Taro.removeStorageSync('token')
    }

    return Promise.reject(error)
  }
)

/**
 * 核心请求导出
 */
export const request = <T>(url: string, config: RequestConfig): Promise<T> => {
  return axiosInstance(url, config) as Promise<T>
}

export default request
