import { useEffect } from 'react'
import { Text, View, Image } from '@tarojs/components'
import { Arrow, StarOutlined, AppsOutlined, GoldCoinOutlined } from '@taroify/icons'
import Taro from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setUserInfoAction, setTokenAction, logoutAction } from '@/store/slices/userSlice'
import { getLoginUser, userLogout, userLoginByMa } from '@/api/user/userController'
import { setToken, setUserInfo, removeToken, removeUserInfo } from '@/utils/auth'

import './index.scss'
import '../contact/index.scss'

export default function ProfileIndex() {
  const dispatch = useDispatch()
  const { userInfo, isLoggedIn } = useSelector((state: RootState) => state.user)

  // Fetch user info when logged in
  useEffect(() => {
    if (isLoggedIn && !userInfo) {
      fetchUserInfo()
    }
  }, [isLoggedIn, userInfo])

  const fetchUserInfo = async () => {
    try {
      const res = await getLoginUser()
      if (res.code === 0 && res.data) {
        dispatch(setUserInfoAction(res.data))
        setUserInfo(res.data)
      }
    } catch (err) {
      console.error('Fetch user info failed:', err)
    }
  }

  const handleLogin = async () => {
    try {
      Taro.showLoading({ title: '登录中...' })
      const { code } = await Taro.login()
      
      const res = await userLoginByMa({ code })
      
      if (res.code === 0 && res.data) {
        const { token } = res.data
        if (token) {
          setToken(token)
          dispatch(setTokenAction(token))
          // After token is set, fetch full user info
          await fetchUserInfo()
          Taro.showToast({ title: '登录成功', icon: 'success' })
        }
      }
    } catch (err) {
      console.error('Login failed:', err)
      Taro.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  }

  const handleLogout = async () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await userLogout()
          } catch (e) {
            // Ignore logout API failure
          }
          // Clear local state regardless of API success
          removeToken()
          removeUserInfo()
          dispatch(logoutAction())
          Taro.reLaunch({ url: '/pages/index/index' })
        }
      }
    })
  }

  return (
    <View className='mall-page'>
      <View className='mall-page__body'>
        <View className='profile-bg-header' />

        {/* Profile card */}
        <View className='profile-card' onClick={!isLoggedIn ? handleLogin : () => Taro.navigateTo({ url: '/pages/profile/edit/index' })}>
          <View className='profile-card__top'>
            <View className='profile-card__avatar-wrap'>
              <Image 
                src={userInfo?.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'} 
                className='profile-card__avatar' 
              />
              {isLoggedIn && <View className='profile-card__online-dot' />}
            </View>
            <View className='profile-card__main'>
              <Text className='profile-card__name'>
                {isLoggedIn ? (userInfo?.userName || '未设置昵称') : '点击登录'}
              </Text>
              <Text className='profile-card__id'>
                {isLoggedIn ? `ID: ${userInfo?.id || '---'}` : '登录体验更多功能'}
              </Text>
            </View>
            <Arrow size='20px' style={{ color: '#C7C7CC' }} />
          </View>

          <View className='profile-card__stats'>
            <View className='profile-card__stat-item'>
              <Text className='profile-card__stat-val'>0</Text>
              <Text className='profile-card__stat-label'>空间访客</Text>
            </View>
            <View className='profile-card__stat-item'>
              <Text className='profile-card__stat-val'>0</Text>
              <Text className='profile-card__stat-label'>好友动态</Text>
            </View>
            <View className='profile-card__stat-item'>
              <Text className='profile-card__stat-val'>0</Text>
              <Text className='profile-card__stat-label'>我的收藏</Text>
            </View>
          </View>
        </View>

        {/* Service list */}
        <View className='profile-body'>
          <View className='ios-card-group'>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <GoldCoinOutlined size='24px' style={{ color: '#3B82F6', width: '48rpx', marginRight: '24rpx' }} />
              <View className='ios-card-item__content'>
                <Text className='ios-card-item__title'>我的钱包</Text>
                <Text className='ios-card-item__sub'>¥ 0.00</Text>
                <Arrow size='16px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <StarOutlined size='24px' style={{ color: '#FBBF24', width: '48rpx', marginRight: '24rpx' }} />
              <View className='ios-card-item__content last'>
                <Text className='ios-card-item__title'>我的收藏</Text>
                <Arrow size='16px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
          </View>

          <View className='ios-card-group'>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <AppsOutlined size='24px' style={{ color: '#F97316', width: '48rpx', marginRight: '24rpx' }} />
              <View className='ios-card-item__content last'>
                <Text className='ios-card-item__title'>小程序</Text>
                <Arrow size='16px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
          </View>

          {isLoggedIn && (
            <View className='ios-card-group' style={{ marginTop: '32rpx' }}>
              <View 
                className='ios-card-item' 
                hoverClass='ios-card-item--pressed'
                onClick={handleLogout}
              >
                <View className='ios-card-item__content last' style={{ justifyContent: 'center' }}>
                  <Text className='ios-card-item__title' style={{ color: '#EF4444' }}>退出登录</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

