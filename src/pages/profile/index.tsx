import { useEffect, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { View } from '@tarojs/components'
import { Arrow, StarOutlined, GoldCoinOutlined, SettingOutlined, Bell, UserOutlined } from '@taroify/icons'
import Taro, { useDidShow } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setUserInfoAction, setTokenAction, logoutAction } from '@/store/slices/userSlice'
import { getLoginUser, userLogout, userLoginByMa } from '@/api/user/userController'
import { setToken, setUserInfo, removeToken, removeUserInfo } from '@/utils/auth'
import { refreshNotificationBadge } from '@/utils/notification'
import { Cell, Avatar, Badge, Search } from '@taroify/core'
import PageShell from '@/components/PageShell'
import InsetCard from '@/components/InsetCard'
import ActionPill from '@/components/ActionPill'

import './index.scss'

const searchStyle = {
  '--search-background-color': '#F3F4F6',
  '--search-content-background-color': '#FFFFFF',
  '--search-padding': '8rpx 16rpx',
  '--search-input-height': '72rpx',
} as CSSProperties

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
    if (!isLoggedIn) {
      setUnreadNote(0)
      await Taro.removeTabBarBadge({ index: 2 })
      return
    }
    try {
      const count = await refreshNotificationBadge()
      setUnreadNote(count)
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
          setUnreadNote(0)
          await Taro.removeTabBarBadge({ index: 2 })
          Taro.reLaunch({ url: '/pages/index/index' })
        }
      }
    })
  }

  return (
    <PageShell
      header={(
        <View className='mall-page-toolbar mall-page-toolbar--search-only'>
          <Search
            placeholder='搜索系统设置（暂未开放）'
            readonly
            disabled
            style={searchStyle}
          />
        </View>
      )}
      contentClassName='mall-page__content--top-gap'
    >
      <View className='profile-hero' onClick={!isLoggedIn ? handleLogin : () => Taro.navigateTo({ url: '/pages/profile/edit/index' })}>
        <Avatar
          className='mall-avatar profile-hero__avatar'
          src={userInfo?.userAvatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=guest'}
          style={{ width: '96rpx', height: '96rpx' }}
        >
          <UserOutlined />
        </Avatar>
        <View className='profile-hero__body'>
          <View className='profile-hero__name'>{isLoggedIn ? (userInfo?.userName || '设置昵称') : '点击登录'}</View>
          <View className='profile-hero__meta'>{isLoggedIn ? `ID: ${userInfo?.id}` : '微信快捷登录'}</View>
          <View className='profile-hero__desc'>
            {isLoggedIn ? (userInfo?.userProfile || '账号与资料设置') : '登录体验更多社交功能'}
          </View>
        </View>
        <View className='profile-hero__actions'>
          {isLoggedIn ? (
            <ActionPill
              text='编辑'
              variant='subtle'
              onClick={() => Taro.navigateTo({ url: '/pages/profile/edit/index' })}
            />
          ) : null}
          <Arrow color='#98A2B3' />
        </View>
      </View>

      <View className='mall-section-title'>资产与收藏</View>
      <InsetCard className='profile-card'>
        <Cell
          title='我的钱包'
          icon={<View className='profile-icon-box'><GoldCoinOutlined color='#0A84FF' /></View>}
          rightIcon={<Arrow />}
          style={{ opacity: 0.58 }}
        >
          ¥ 0.00
        </Cell>
        <Cell
          title='我的收藏'
          icon={<View className='profile-icon-box'><StarOutlined color='#0A84FF' /></View>}
          rightIcon={<Arrow />}
          style={{ opacity: 0.58 }}
        >
          暂未开放
        </Cell>
      </InsetCard>

      <View className='mall-section-title'>系统服务</View>
      <InsetCard className='profile-card'>
        <Cell
          title='通知中心'
          icon={<View className='profile-icon-box profile-icon-box--active'><Bell color='#0A84FF' /></View>}
          onClick={() => Taro.navigateTo({ url: '/pages/notification/index' })}
          rightIcon={<Arrow />}
          clickable
        >
          {unreadNote > 0 ? <Badge content={unreadNote > 99 ? '99+' : unreadNote} /> : null}
        </Cell>
        <Cell
          title='通用设置'
          icon={<View className='profile-icon-box'><SettingOutlined color='#0A84FF' /></View>}
          rightIcon={<Arrow />}
          style={{ opacity: 0.58 }}
        >
          暂未开放
        </Cell>
      </InsetCard>

      {isLoggedIn ? (
        <InsetCard className='profile-card'>
          <Cell
            title='退出登录'
            onClick={handleLogout}
            style={{ color: 'var(--ios-red)', textAlign: 'center', justifyContent: 'center' }}
            clickable
          />
        </InsetCard>
      ) : null}

      <View className='profile-footer'>
        <View>MallChat v1.0.0 Alpha</View>
      </View>
    </PageShell>
  )
}
