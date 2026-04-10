import { useState, useCallback } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { Bell, Passed } from '@taroify/icons'
import Taro, { useDidShow } from '@tarojs/taro'
import { listMyNotificationVoByPage, markAllNotificationRead, markNotificationRead } from '@/api/notification/notificationController'
import { Skeleton, Empty, Cell, Avatar, Badge } from '@taroify/core'

import './index.scss'

export default function NotificationPage() {
  const [list, setList] = useState<NotificationAPI.NotificationVO[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    try {
      const res = await listMyNotificationVoByPage({
        current: 1,
        pageSize: 50,
        sortField: 'createTime',
        sortOrder: 'descend'
      })
      if (res.code === 0 && res.data?.records) {
        setList(res.data.records)
      }
    } catch (err) {
      console.error('Fetch notifications failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useDidShow(() => {
    fetchNotifications()
  })

  const handleMarkAllRead = async () => {
    if (markingAll || list.every(item => item.isRead === 1)) return
    setMarkingAll(true)
    try {
      const res = await markAllNotificationRead()
      if (res.code === 0) {
        Taro.showToast({ title: '已全部标记为已读', icon: 'success' })
        fetchNotifications(true)
      }
    } catch (err) {
      console.error('Mark all read failed:', err)
    } finally {
      setMarkingAll(false)
    }
  }

  const handleItemClick = async (item: NotificationAPI.NotificationVO) => {
    if (item.isRead === 0) {
      try {
        await markNotificationRead({ id: item.id })
        setList(prev => prev.map(i => i.id === item.id ? { ...i, isRead: 1 } : i))
      } catch (e) {
        console.error('Mark read failed:', e)
      }
    }
    
    if (item.contentUrl) {
      if (item.contentUrl.startsWith('/pages/')) {
        Taro.navigateTo({ url: item.contentUrl })
      } else if (item.contentUrl.startsWith('http')) {
        Taro.setClipboardData({ data: item.contentUrl })
      }
    }
  }

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return ''
    const date = new Date(timeStr.replace(/-/g, '/'))
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const getIconColor = (type?: string) => {
    switch (type) {
      case 'system': return '#FF9500'
      case 'broadcast': return '#FF3B30'
      default: return '#007AFF'
    }
  }

  return (
    <View className='mall-page'>
      <View className='page-header'>
        <View className='page-header__title'>通知</View>
        <View className='page-header__actions'>
          <View 
            onClick={handleMarkAllRead} 
            style={{ display: 'flex', alignItems: 'center', gap: '8rpx', opacity: markingAll ? 0.5 : 1 }}
          >
            <Passed size='18px' color='#333' />
            <View style={{ fontSize: '28rpx', color: '#333' }}>全部已读</View>
          </View>
        </View>
      </View>

      <ScrollView scrollY className='mall-page__body'>
        {loading && list.length === 0 ? (
          <View style={{ padding: '32rpx' }}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ display: 'flex', marginBottom: '32rpx', gap: '24rpx' }}>
                <Skeleton variant='circle' width='80rpx' height='80rpx' />
                <View style={{ flex: 1, paddingTop: '10rpx' }}>
                  <Skeleton variant='rect' height='32rpx' width='40%' style={{ marginBottom: '16rpx' }} />
                  <Skeleton variant='rect' height='24rpx' width='80%' />
                </View>
              </View>
            ))}
          </View>
        ) : list.length === 0 ? (
          <Empty style={{ marginTop: '20vh' }}>
            <Empty.Description>暂无通知</Empty.Description>
          </Empty>
        ) : (
          <Cell.Group>
            {list.map((item) => (
              <Cell 
                key={item.id} 
                clickable
                onClick={() => handleItemClick(item)}
                title={item.title || '系统通知'}
                label={item.content}
                icon={
                  <View style={{ position: 'relative', marginRight: '24rpx', opacity: item.isRead === 1 ? 0.6 : 1 }}>
                    <Avatar 
                      shape='circle' 
                      style={{ backgroundColor: getIconColor(item.type), width: '80rpx', height: '80rpx' }}
                    >
                      <Bell size='20px' color='#fff' />
                    </Avatar>
                    {item.isRead === 0 && <Badge dot style={{ position: 'absolute', top: 0, right: 0 }} />}
                  </View>
                }
                extra={
                  <View style={{ fontSize: '24rpx', color: '#999', marginTop: '4rpx' }}>
                    {formatTime(item.createTime)}
                  </View>
                }
                style={{
                  alignItems: 'flex-start',
                  padding: '24rpx 32rpx'
                }}
              />
            ))}
          </Cell.Group>
        )}
      </ScrollView>
    </View>
  )
}
