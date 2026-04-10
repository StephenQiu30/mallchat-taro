import { useState, useCallback } from 'react'
import { Input, Text, View, Image } from '@tarojs/components'
import { Search } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listMySessions, topSession, deleteSession } from '@/api/chat/chatSessionController'
import { Skeleton, Empty } from '@taroify/core'

import './index.scss'

export default function MessageIndex() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [listData, setListData] = useState<ChatAPI.ChatSessionVO[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async (isSilent = false) => {
    if (!isLoggedIn) {
      // Not logged in — keep skeleton visible as placeholder
      setListData([])
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

  // Long press handler — show ActionSheet for pin/delete
  const handleLongPress = (session: ChatAPI.ChatSessionVO) => {
    const isPinned = session.topStatus === 1
    Taro.showActionSheet({
      itemList: [isPinned ? '取消置顶' : '置顶', '删除会话'],
      success: async (res) => {
        if (res.tapIndex === 0) {
          // Toggle pin
          try {
            const topRes = await topSession({
              roomId: session.roomId!,
              status: isPinned ? 0 : 1
            })
            if (topRes.code === 0) {
              Taro.showToast({
                title: isPinned ? '已取消置顶' : '已置顶',
                icon: 'success'
              })
              fetchSessions(true)
            }
          } catch (err) {
            console.error('Top session failed:', err)
          }
        } else if (res.tapIndex === 1) {
          // Delete session
          Taro.showModal({
            title: '提示',
            content: '确定删除该会话吗？',
            success: async (modalRes) => {
              if (modalRes.confirm) {
                try {
                  const delRes = await deleteSession({ id: session.roomId! })
                  if (delRes.code === 0) {
                    Taro.showToast({ title: '已删除', icon: 'success' })
                    fetchSessions(true)
                  }
                } catch (err) {
                  console.error('Delete session failed:', err)
                }
              }
            }
          })
        }
      }
    })
  }

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
            <Empty>
              <Empty.Image src='default' />
              <Empty.Description>暂无更多消息</Empty.Description>
            </Empty>
          ) : (
              listData.map((msg) => (
                <View
                  key={msg.roomId}
                  className={`mall-list-item ${msg.topStatus === 1 ? 'message-item--pinned' : ''}`}
                  hoverClass='message-item--pressed'
                  hoverStayTime={80}
                  onClick={() => Taro.navigateTo({ 
                    url: `/pages/chat/index?id=${msg.roomId}&name=${encodeURIComponent(msg.name || '')}` 
                  })}
                  onLongPress={() => handleLongPress(msg)}
                >
                  <View className='message-item__avatar-wrap'>
                    <Image 
                      src={msg.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.roomId}`} 
                      className='mall-avatar mall-avatar--rounded message-item__avatar-img'
                      mode='aspectFill'
                    />
                    {(msg.unreadCount || 0) > 0 && (
                      <View className='message-item__badge mall-badge'>
                        {(msg.unreadCount || 0) > 99 ? '99+' : msg.unreadCount}
                      </View>
                    )}
                  </View>

                  <View className='message-item__content'>
                    <View className='message-item__row'>
                      <View style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <Text className='message-item__name mall-text-ellipsis'>{msg.name}</Text>
                        {msg.topStatus === 1 && (
                          <View className='message-item__pin-icon' />
                        )}
                      </View>
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
