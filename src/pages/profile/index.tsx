import { useEffect, useState, useCallback } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { Arrow, StarOutlined, GoldCoinOutlined, SettingOutlined, Bell, UserOutlined } from '@taroify/icons'
import Taro, { useDidShow } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setUserInfoAction, setTokenAction, logoutAction } from '@/store/slices/userSlice'
import { getLoginUser, userLogout, userLoginByMa } from '@/api/user/userController'
import { getNotificationUnreadCount } from '@/api/notification/notificationController'
import { setToken, setUserInfo, removeToken, removeUserInfo } from '@/utils/auth'
import { Cell, Avatar, Badge, Search } from '@taroify/core'

import './index.scss'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { userInfo, isLoggedIn } = useSelector((state: RootState) => state.user)
  const [unreadNote, setUnreadNote] = useState(0)

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

  const fetchUnread = useCallback(async () => {
    if (!isLoggedIn) return
    try {
      const res = await getNotificationUnreadCount()
      if (res.code === 0 && res.data !== undefined) {
        const count = Number(res.data)
        setUnreadNote(count)
        if (count > 0) {
          Taro.setTabBarBadge({ index: 2, text: count > 99 ? '99+' : String(count) })
        } else {
          Taro.removeTabBarBadge({ index: 2 })
        }
      }
    } catch (e) {
      console.error('Fetch unread count failed:', e)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoggedIn && !userInfo) {
      fetchUserInfo()
    }
  }, [isLoggedIn, userInfo])

  useDidShow(() => {
    fetchUnread()
  })

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
          await fetchUserInfo()
          await fetchUnread()
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
          } catch (e) { }
          removeToken()
          removeUserInfo()
          dispatch(logoutAction())
          Taro.removeTabBarBadge({ index: 2 })
          Taro.reLaunch({ url: '/pages/index/index' })
        }
      }
    })
  }

  return (
    <View className='mall-page'>
      <View className='ios-glass-header'>
        <View className='search-container' style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
          <View style={{ flex: 1 }}>
            <Search 
              placeholder='搜索系统设置' 
              style={{ 
                '--search-background-color': '#E9E9EB',
                '--search-padding': '8rpx 16rpx',
                '--search-input-height': '72rpx'
              }} 
            />
          </View>
        </View>
      </View>

      <ScrollView scrollY className='mall-page__body'>
        {/* User Profile Header Card */}
        <View className='ios-card-group' style={{ marginTop: '32rpx' }}>
          <Cell
            clickable
            onClick={!isLoggedIn ? handleLogin : () => Taro.navigateTo({ url: '/pages/profile/edit/index' })}
            title={isLoggedIn ? (userInfo?.userName || '设置昵称') : '点击登录'}
            label={isLoggedIn ? (userInfo?.userProfile || `ID: ${userInfo?.id}`) : '登录体验更多社交功能'}
            icon={
              <Avatar 
                className='mall-avatar'
                src={userInfo?.userAvatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=guest'} 
                style={{ width: '120rpx', height: '120rpx', marginRight: '28rpx' }}
              >
                <UserOutlined />
              </Avatar>
            }
            rightIcon={<Arrow />}
            style={{ padding: '40rpx 32rpx' }}
          />
        </View>

        {/* Function Groups */}
        <View className='ios-group-title'>资产与收藏</View>
        <View className='ios-card-group'>
          <Cell 
            title='我的钱包' 
            icon={<View className='icon-box blue'><GoldCoinOutlined color='#fff' /></View>} 
            extra='¥ 0.00' 
            rightIcon={<Arrow />}
            clickable
          />
          <Cell 
            title='我的收藏' 
            icon={<View className='icon-box orange'><StarOutlined color='#fff' /></View>} 
            rightIcon={<Arrow />}
            clickable
          />
        </View>

        <View className='ios-group-title'>系统服务</View>
        <View className='ios-card-group'>
          <Cell 
            title='通知中心' 
            icon={<View className='icon-box red'><Bell color='#fff' /></View>} 
            onClick={() => Taro.navigateTo({ url: '/pages/notification/index' })}
            extra={unreadNote > 0 ? <Badge content={unreadNote > 99 ? '99+' : unreadNote} /> : null}
            rightIcon={<Arrow />}
            clickable
          />
          <Cell 
            title='通用设置' 
            icon={<View className='icon-box indigo'><SettingOutlined color='#fff' /></View>} 
            rightIcon={<Arrow />}
            clickable
          />
        </View>

        {isLoggedIn && (
          <View className='ios-card-group'>
            <Cell 
              title='退出登录' 
              onClick={handleLogout}
              style={{ color: 'var(--ios-red)', textAlign: 'center' }}
              clickable
            />
          </View>
        )}

        <View className='profile-footer'>
          <View>MallChat v1.0.0 Alpha</View>
          <View style={{ marginTop: '8rpx', opacity: 0.6 }}>Design Inspired by Apple iOS</View>
        </View>
      </ScrollView>
    </View>
  )
}
