import { useState, useCallback, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { View } from '@tarojs/components'
import { Comment, Add, UserOutlined } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listMySessions, topSession, deleteSession } from '@/api/chat/chatSessionController'
import { wsManager, WsMessageType } from '@/services/websocket'
import { refreshNotificationBadge } from '@/utils/notification'
import { Search, Avatar, Badge } from '@taroify/core'
import PageShell from '@/components/PageShell'
import ActionPill from '@/components/ActionPill'
import ListStatus from '@/components/ListStatus'

import './index.scss'

const searchStyle = {
  '--search-background-color': '#F3F4F6',
  '--search-content-background-color': '#FFFFFF',
  '--search-padding': '8rpx 16rpx',
  '--search-input-height': '72rpx',
} as CSSProperties

export default function MessageIndex() {
  const { isLoggedIn, userInfo } = useSelector((state: RootState) => state.user)
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

  useEffect(() => {
    if (!isLoggedIn) return
    const unsubscribe = wsManager.on(WsMessageType.MESSAGE, () => {
      fetchSessions(true)
    })
    return () => { unsubscribe() }
  }, [isLoggedIn, fetchSessions])

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

  const handleCreateAction = () => {
    Taro.showActionSheet({
      itemList: ['创建群聊', '添加好友', 'AI 助手'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.navigateTo({ url: '/pages/chat/group/create/index' })
        } else if (res.tapIndex === 1) {
          Taro.navigateTo({ url: '/pages/contact/search/index' })
        } else if (res.tapIndex === 2) {
          Taro.navigateTo({ url: '/pages/chat/ai/index' })
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
    <PageShell
      header={(
        <View className='session-header-wrap'>
          <View className='session-header'>
            <Avatar
              className='mall-avatar mall-avatar--circle session-header__avatar'
              src={userInfo?.userAvatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=mallchat-user'}
              style={{ width: '80rpx', height: '80rpx' }}
            >
              <UserOutlined />
            </Avatar>
            <View className='session-header__title-block'>
              <View className='session-header__eyebrow'>MallChat</View>
              <View className='session-header__title'>消息</View>
            </View>
            <View className='session-header__add' onClick={handleCreateAction}>
              <Add size='20px' color='#344054' />
            </View>
          </View>
          <View className='mall-page-toolbar session-toolbar'>
            <Search
              placeholder='搜索聊天记录'
              value={keyword}
              onChange={(event) => setKeyword(event.detail.value)}
              onClear={() => setKeyword('')}
              style={searchStyle}
            />
            <ActionPill
              icon={<Comment size='18px' color='#0A84FF' />}
              text='AI 助手'
              onClick={() => Taro.navigateTo({ url: '/pages/chat/ai/index' })}
            />
          </View>
        </View>
      )}
      contentClassName='mall-page__content--top-gap'
    >
      {!isLoggedIn ? (
        <ListStatus kind='login' description='登录后查看你的会话列表' />
      ) : loading && listData.length === 0 ? (
        <ListStatus kind='loading' description='' skeletonRows={5} />
      ) : filteredSessions.length === 0 ? (
        <ListStatus kind='empty' description={keyword.trim() ? '未找到相关会话' : '开启你的第一条消息'} />
      ) : (
        <View className='mall-card-list'>
          {filteredSessions.map((session) => (
            <View
              key={session.roomId}
              className={`mall-card-item mall-card-item--active ${session.topStatus === 1 ? 'mall-card-item--highlight session-card--pinned' : ''}`}
              onClick={() => Taro.navigateTo({
                url: `/pages/chat/index?id=${session.roomId}&name=${encodeURIComponent(session.name || '')}`
              })}
              onLongPress={() => handleLongPress(session)}
            >
              <View className={`session-card__avatar ${session.type === 1 ? 'session-card__avatar--group' : ''}`}>
                <Avatar
                  className={`mall-avatar ${session.type === 1 ? 'session-card__avatar-img--group' : 'mall-avatar--circle'}`}
                  src={session.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${session.roomId}`}
                  style={{ width: '104rpx', height: '104rpx' }}
                />
                {session.type === 2 ? (
                  <View className={`session-card__status-dot ${session.onlineStatus === 1 ? 'session-card__status-dot--online' : ''}`} />
                ) : null}
                {(session.unreadCount || 0) > 0 ? (
                  <Badge
                    className='session-card__badge'
                    content={(session.unreadCount || 0) > 99 ? '99+' : session.unreadCount}
                  />
                ) : null}
              </View>

              <View className='mall-card-item__content'>
                <View className='mall-card-item__row'>
                  <View className='mall-card-item__title mall-text-ellipsis'>{session.name || '未命名会话'}</View>
                  <View className='mall-card-item__meta'>{formatTime(session.activeTime)}</View>
                </View>
                <View className='mall-card-item__desc mall-text-clamp-2'>
                  {session.type === 1 && (session.unreadCount || 0) > 0 ? '[群聊] ' : ''}
                  {session.lastMessage || '暂无内容'}
                </View>
                <View className='session-card__tags'>
                  {session.topStatus === 1 ? <View className='mall-card-item__hint'>置顶</View> : null}
                  {session.type === 1 ? <View className='mall-card-item__hint'>群聊</View> : null}
                  {session.type === 2 && session.onlineStatus === 1 ? <View className='mall-card-item__hint'>在线</View> : null}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </PageShell>
  )
}
