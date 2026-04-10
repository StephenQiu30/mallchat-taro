import { useState, useCallback } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { Comment } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listMySessions, topSession, deleteSession } from '@/api/chat/chatSessionController'
import { getNotificationUnreadCount } from '@/api/notification/notificationController'
import { Skeleton, Empty, Search, Cell, Avatar, Badge } from '@taroify/core'

import './index.scss'

export default function MessageIndex() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [listData, setListData] = useState<ChatAPI.ChatSessionVO[]>([])
  const [unreadNote, setUnreadNote] = useState(0) // Still used for Tabbar sync
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async (isSilent = false) => {
    if (!isLoggedIn) {
      setListData([])
      setUnreadNote(0)
      Taro.stopPullDownRefresh()
      return
    }
    
    if (!isSilent) setLoading(true)
    try {
      const [sessionRes, noteRes] = await Promise.all([
        listMySessions(),
        getNotificationUnreadCount()
      ])
      
      if (sessionRes.code === 0 && sessionRes.data) {
        setListData(sessionRes.data)
      }
      if (noteRes.code === 0 && noteRes.data !== undefined) {
        const count = Number(noteRes.data)
        setUnreadNote(count)
        if (count > 0) {
          Taro.setTabBarBadge({ index: 2, text: count > 99 ? '99+' : String(count) })
        } else {
          Taro.removeTabBarBadge({ index: 2 })
        }
      }
    } catch (err) {
      console.error('Fetch home data failed:', err)
    } finally {
      setLoading(false)
      Taro.stopPullDownRefresh()
    }
  }, [isLoggedIn])

  useDidShow(() => {
    fetchSessions(listData.length > 0)
  })

  usePullDownRefresh(() => {
    fetchSessions()
  })

  const handleLongPress = (session: ChatAPI.ChatSessionVO) => {
    const isPinned = session.topStatus === 1
    Taro.showActionSheet({
      itemList: [isPinned ? '取消置顶' : '置顶', '删除会话'],
      success: async (res) => {
        if (res.tapIndex === 0) {
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
      <View className='ios-glass-header'>
        <View className='search-container' style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
          <View style={{ flex: 1 }}>
            <Search 
              placeholder='搜索聊天记录' 
              style={{ 
                '--search-background-color': '#E9E9EB',
                '--search-padding': '8rpx 16rpx',
                '--search-input-height': '72rpx'
              }} 
            />
          </View>
          <View className='icon-btn' onClick={() => Taro.navigateTo({ url: '/pages/chat/ai/index' })} style={{ width: '72rpx', height: '72rpx' }}>
            <Comment size='20px' color='var(--ios-blue)' />
          </View>
        </View>
      </View>

      <ScrollView scrollY className='mall-page__body'>
        {loading && listData.length === 0 ? (
          <View style={{ padding: '32rpx' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={{ display: 'flex', marginBottom: '32rpx', gap: '24rpx' }}>
                <Skeleton variant='circle' width='96rpx' height='96rpx' />
                <View style={{ flex: 1, paddingTop: '8rpx' }}>
                  <Skeleton variant='rect' height='32rpx' width='40%' style={{ marginBottom: '16rpx' }} />
                  <Skeleton variant='rect' height='24rpx' width='80%' />
                </View>
              </View>
            ))}
          </View>
        ) : listData.length === 0 ? (
          <Empty style={{ marginTop: '20vh' }}>
            <Empty.Image src='default' />
            <Empty.Description>开启你的第一条消息</Empty.Description>
          </Empty>
        ) : (
          <Cell.Group>
            {listData.map((session) => (
              <Cell
                key={session.roomId}
                clickable
                onClick={() => Taro.navigateTo({ 
                  url: `/pages/chat/index?id=${session.roomId}&name=${encodeURIComponent(session.name || '')}` 
                })}
                onLongPress={() => handleLongPress(session)}
                title={session.name}
                label={session.lastMessage || '暂无内容'}
                icon={
                  <View className='session-avatar-wrap'>
                    <Avatar 
                      className='mall-avatar'
                      src={session.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${session.roomId}`} 
                      style={{ width: '100rpx', height: '100rpx' }}
                    />
                    {(session.unreadCount || 0) > 0 && (
                      <Badge 
                        content={(session.unreadCount || 0) > 99 ? '99+' : session.unreadCount} 
                        style={{ 
                          position: 'absolute', 
                          top: '-4rpx', 
                          right: '-4rpx',
                          backgroundColor: 'var(--ios-red)',
                          border: '4rpx solid #fff'
                        }} 
                      />
                    )}
                  </View>
                }
                extra={
                  <View className='session-extra'>
                    <View className='session-time'>{formatTime(session.activeTime)}</View>
                  </View>
                }
                style={{
                  backgroundColor: session.topStatus === 1 ? 'var(--ios-bg-secondary)' : '#fff',
                  padding: '28rpx 32rpx'
                }}
              />
            ))}
          </Cell.Group>
        )}
      </ScrollView>
    </View>
  )
}
