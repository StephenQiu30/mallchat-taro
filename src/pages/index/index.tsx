import { useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { Comment } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listMySessions, topSession, deleteSession } from '@/api/chat/chatSessionController'
import { refreshNotificationBadge } from '@/utils/notification'
import { Skeleton, Empty, Search, Cell, Avatar, Badge, Button } from '@taroify/core'

import './index.scss'

const searchStyle = {
  '--search-background-color': '#E9E9EB',
  '--search-padding': '8rpx 16rpx',
  '--search-input-height': '72rpx',
} as CSSProperties

export default function MessageIndex() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [listData, setListData] = useState<ChatAPI.ChatSessionVO[]>([])
  const [keyword, setKeyword] = useState('')
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
      const sessionRes = await listMySessions()
      
      if (sessionRes.code === 0 && sessionRes.data) {
        setListData(sessionRes.data)
      }
      await refreshNotificationBadge()
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

  const filteredSessions = listData.filter((session) => {
    const target = `${session.name || ''} ${session.lastMessage || ''}`.toLowerCase()
    return target.includes(keyword.trim().toLowerCase())
  })

  return (
    <View className='mall-page'>
      <View className='ios-glass-header'>
        <View className='search-container' style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
          <View style={{ flex: 1 }}>
            <Search 
              placeholder='搜索聊天记录' 
              value={keyword}
              onChange={(event) => setKeyword(event.detail.value)}
              onClear={() => setKeyword('')}
              style={searchStyle}
            />
          </View>
          <View className='icon-btn' onClick={() => Taro.navigateTo({ url: '/pages/chat/ai/index' })} style={{ width: '72rpx', height: '72rpx' }}>
            <Comment size='20px' color='var(--ios-blue)' />
          </View>
        </View>
      </View>

      <ScrollView scrollY className='mall-page__body'>
        {!isLoggedIn ? (
          <Empty style={{ marginTop: '20vh' }}>
            <Empty.Description>登录后查看你的会话列表</Empty.Description>
            <Button
              color='primary'
              shape='round'
              size='small'
              style={{ marginTop: '24rpx' }}
              onClick={() => Taro.switchTab({ url: '/pages/profile/index' })}
            >
              去登录
            </Button>
          </Empty>
        ) : loading && listData.length === 0 ? (
          <View style={{ padding: '32rpx' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={{ marginBottom: '32rpx' }}>
                <Skeleton avatar title row={2} loading />
              </View>
            ))}
          </View>
        ) : filteredSessions.length === 0 ? (
          <Empty style={{ marginTop: '20vh' }}>
            <Empty.Image src='default' />
            <Empty.Description>{keyword.trim() ? '未找到相关会话' : '开启你的第一条消息'}</Empty.Description>
          </Empty>
        ) : (
          <Cell.Group>
            {filteredSessions.map((session) => (
              <Cell
                key={session.roomId}
                clickable
                onClick={() => Taro.navigateTo({ 
                  url: `/pages/chat/index?id=${session.roomId}&name=${encodeURIComponent(session.name || '')}` 
                })}
                onLongPress={() => handleLongPress(session)}
                title={session.name}
                brief={session.lastMessage || '暂无内容'}
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
                titleStyle={{ fontWeight: 500 }}
                style={{
                  backgroundColor: session.topStatus === 1 ? 'var(--ios-bg-secondary)' : '#fff',
                  padding: '28rpx 32rpx'
                }}
              >
                <View className='session-extra'>
                  <View className='session-time'>{formatTime(session.activeTime)}</View>
                </View>
              </Cell>
            ))}
          </Cell.Group>
        )}
      </ScrollView>
    </View>
  )
}
