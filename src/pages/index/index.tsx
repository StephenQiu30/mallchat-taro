import { useState, useCallback } from 'react'
import { Input, Text, View, Image } from '@tarojs/components'
import { Search } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listMySessions } from '@/api/chat/chatSessionController'
import { Skeleton, Empty } from '@taroify/core'

import './index.scss'

export default function MessageIndex() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [listData, setListData] = useState<ChatAPI.ChatSessionVO[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async (isSilent = false) => {
    if (!isLoggedIn) {
      setListData([])
      setLoading(false)
      Taro.stopPullDownRefresh()
      return
    }
    
    if (!isSilent) setLoading(true)
    try {
      const res = await listMySessions()
      if (res.code === 0 && res.data) {
        setListData(res.data)
      }
    } catch (err) {
      console.error('Fetch sessions failed:', err)
    } finally {
      setLoading(false)
      Taro.stopPullDownRefresh()
    }
  }, [isLoggedIn])

  // Refresh data when page shows
  useDidShow(() => {
    fetchSessions(listData.length > 0)
  })

  // Pull to refresh
  usePullDownRefresh(() => {
    fetchSessions()
  })

  // Format time (e.g., from "2024-03-20 14:20:00" to "14:20" or "昨天")
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return ''
    try {
      const date = new Date(timeStr.replace(/-/g, '/'))
      const now = new Date()
      
      if (date.toDateString() === now.toDateString()) {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      }
      return `${date.getMonth() + 1}-${date.getDate()}`
    } catch (e) {
      return timeStr
    }
  }

  return (
    <View className='mall-page'>
      {/* Search bar */}
      <View className='ios-search'>
        <View className='ios-search__inner'>
          <Search size='16px' style={{ color: '#8E8E93' }} />
          <Input
            className='ios-search__input'
            placeholder='搜索'
            placeholderStyle='color: #8E8E93;'
          />
        </View>
      </View>

      {/* Scrollable message list */}
      <View className='mall-page__body'>
        <View className='message-list'>
          {loading && listData.length === 0 ? (
            <View style={{ padding: '0 32rpx' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <View key={i} style={{ display: 'flex', padding: '24rpx 0', gap: '24rpx' }}>
                  <Skeleton variant='circle' width='100rpx' height='100rpx' />
                  <View style={{ flex: 1, paddingTop: '10rpx' }}>
                    <Skeleton variant='rect' height='32rpx' width='40%' style={{ marginBottom: '16rpx' }} />
                    <Skeleton variant='rect' height='24rpx' width='80%' />
                  </View>
                </View>
              ))}
            </View>
          ) : listData.length === 0 ? (
            <Empty style={{ marginTop: '100rpx' }}>
              <Empty.Image src='network' />
              <Empty.Description>
                {isLoggedIn ? '暂无消息' : '登录后查看消息'}
              </Empty.Description>
              {!isLoggedIn && (
                <View 
                  className='mall-btn mall-btn--primary' 
                  style={{ marginTop: '32rpx' }}
                  onClick={() => Taro.switchTab({ url: '/pages/profile/index' })}
                >
                  去登录
                </View>
              )}
            </Empty>
          ) : (
            listData.map((msg) => (
              <View
                key={msg.roomId}
                className='message-item'
                hoverClass='message-item--pressed'
                hoverStayTime={80}
                onClick={() => Taro.navigateTo({ 
                  url: `/pages/chat/index?id=${msg.roomId}&name=${encodeURIComponent(msg.name || '')}` 
                })}
              >
                <View className='message-item__avatar-wrap'>
                  <Image 
                    src={msg.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.roomId}`} 
                    className='message-item__avatar-img' 
                  />
                  {(msg.unreadCount || 0) > 0 && (
                    <View className='message-item__badge'>
                      {(msg.unreadCount || 0) > 99 ? '99+' : msg.unreadCount}
                    </View>
                  )}
                </View>

                <View className='message-item__content'>
                  <View className='message-item__row'>
                    <Text className='message-item__name mall-text-ellipsis'>{msg.name}</Text>
                    <Text className='message-item__time'>{formatTime(msg.activeTime)}</Text>
                  </View>
                  <Text className='message-item__text mall-text-ellipsis'>
                    {msg.lastMessage || '暂无内容'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  )
}

