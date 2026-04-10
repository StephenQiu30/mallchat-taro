import Taro from '@tarojs/taro'

const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'user_info'

/**
 * 设置 Token
 * @param token 
 */
export const setToken = (token: string) => {
  Taro.setStorageSync(TOKEN_KEY, token)
}

/**
 * 获取 Token
 */
export const getToken = (): string => {
  return Taro.getStorageSync(TOKEN_KEY) || ''
}

/**
 * 移除 Token
 */
export const removeToken = () => {
  Taro.removeStorageSync(TOKEN_KEY)
}

/**
 * 设置用户信息
 * @param userInfo 
 */
export const setUserInfo = (userInfo: any) => {
  Taro.setStorageSync(USER_INFO_KEY, userInfo)
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return Taro.getStorageSync(USER_INFO_KEY)
}

/**
 * 移除用户信息
 */
export const removeUserInfo = () => {
  Taro.removeStorageSync(USER_INFO_KEY)
}
