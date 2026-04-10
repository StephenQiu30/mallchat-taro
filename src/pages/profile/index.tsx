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
        {/* Profile Header */}
        <View 
          className='profile-header' 
          onClick={!isLoggedIn ? handleLogin : () => Taro.navigateTo({ url: '/pages/profile/edit/index' })}
        >
          <Image 
            src={userInfo?.userAvatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=guest'} 
            className='mall-avatar mall-avatar--rounded profile-header__avatar-img'
            mode='aspectFill'
          />
          <View className='profile-header__main'>
            <Text className='profile-header__name'>
              {isLoggedIn ? (userInfo?.userName || '未设置昵称') : '点击登录'}
            </Text>
            <Text className='profile-header__id'>
              {isLoggedIn ? `账号: ${userInfo?.id || '---'}` : '登录体验更多社交功能'}
            </Text>
          </View>
          <Arrow size='18px' style={{ color: '#C7C7CC' }} />
        </View>

        {/* Service list */}
        <View className='profile-body ios-body'>
          <View className='ios-card-group'>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <GoldCoinOutlined size='22px' style={{ color: '#3B82F6', marginRight: '24rpx' }} />
              <View className='ios-card-item__content'>
                <Text className='ios-card-item__title'>我的钱包</Text>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className='ios-card-item__sub'>¥ 0.00</Text>
                  <Arrow size='14px' style={{ color: '#C7C7CC' }} />
                </View>
              </View>
            </View>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <StarOutlined size='22px' style={{ color: '#FBBF24', marginRight: '24rpx' }} />
              <View className='ios-card-item__content last'>
                <Text className='ios-card-item__title'>我的收藏</Text>
                <Arrow size='14px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
          </View>

          <View className='ios-card-group'>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <AppsOutlined size='22px' style={{ color: '#F97316', marginRight: '24rpx' }} />
              <View className='ios-card-item__content last'>
                <Text className='ios-card-item__title'>更多功能</Text>
                <Arrow size='14px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
          </View>

          {isLoggedIn && (
            <View className='ios-card-group' style={{ marginTop: '48rpx' }}>
              <View 
                className='ios-card-item' 
                hoverClass='ios-card-item--pressed'
                onClick={handleLogout}
              >
                <View className='ios-card-item__content last' style={{ justifyContent: 'center' }}>
                  <Text className='ios-card-item__title' style={{ color: '#FF3B30', fontWeight: 'bold' }}>退出登录</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

