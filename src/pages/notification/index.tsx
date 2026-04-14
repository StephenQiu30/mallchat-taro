import { useState, useCallback } from 'react'
import { View } from '@tarojs/components'
import { Bell, Passed } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listMyNotificationVoByPage, markAllNotificationRead, markNotificationRead } from '@/api/notification/notificationController'
import { refreshNotificationBadge } from '@/utils/notification'
import { Avatar, Badge } from '@taroify/core'
import PageShell from '@/components/PageShell'
import LargeTitleHeader from '@/components/LargeTitleHeader'
import ActionPill from '@/components/ActionPill'
import ListStatus from '@/components/ListStatus'

import './index.scss'

export default function NotificationPage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [list, setList] = useState<NotificationAPI.NotificationVO[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!isLoggedIn) {
      setList([])
      setLoading(false)
      Taro.stopPullDownRefresh()
      return
    }

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
      await refreshNotificationBadge()
    } catch (err) {
      console.error('Fetch notifications failed:', err)
    } finally {
      setLoading(false)
      Taro.stopPullDownRefresh()
    }
  }, [isLoggedIn])

  useDidShow(() => {
    fetchNotifications()
  })

  usePullDownRefresh(() => {
    fetchNotifications()
  })

  const handleMarkAllRead = async () => {
    if (markingAll || list.every(item => item.isRead === 1)) return
    setMarkingAll(true)
    try {
      const res = await markAllNotificationRead()
      if (res.code === 0) {
        setList((prev) => prev.map((item) => ({ ...item, isRead: 1 })))
        Taro.showToast({ title: '已全部标记为已读', icon: 'success' })
        await refreshNotificationBadge()
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
        await refreshNotificationBadge()
      } catch (e) {
        console.error('Mark read failed:', e)
      }
    }
    
    if (item.contentUrl) {
      if (item.contentUrl.startsWith('/pages/')) {
        Taro.navigateTo({ url: item.contentUrl })
      } else if (item.contentUrl.startsWith('http')) {
        Taro.setClipboardData({ data: item.contentUrl })
      } else {
        Taro.showToast({ title: '当前通知不支持跳转', icon: 'none' })
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
      case 'system': return '#E9EEF5'
      case 'broadcast': return '#F3F4F6'
      default: return '#EEF4FB'
    }
  }

  return (
    <PageShell
      header={(
        <LargeTitleHeader
          title='通知'
          actions={(
            <ActionPill
              icon={<Passed size='16px' color={list.every(item => item.isRead === 1) ? '#98A2B3' : '#0A84FF'} />}
              text='全部已读'
              variant='subtle'
              onClick={handleMarkAllRead}
            />
          )}
        />
      )}
      contentClassName='mall-page__content--top-gap'
    >
      {!isLoggedIn ? (
        <ListStatus kind='login' description='登录后查看通知' />
      ) : loading && list.length === 0 ? (
        <ListStatus kind='loading' description='' skeletonRows={4} />
      ) : list.length === 0 ? (
        <ListStatus kind='empty' description='暂无通知' />
      ) : (
        <View className='mall-card-list'>
          {list.map((item) => (
            <View
              key={item.id}
              className={`mall-card-item mall-card-item--active notification-card ${item.isRead === 1 ? 'notification-card--read' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <View className='notification-card__avatar'>
                <Avatar
                  className='mall-avatar mall-avatar--circle'
                  style={{ backgroundColor: getIconColor(item.type), width: '88rpx', height: '88rpx' }}
                >
                  <Bell size='20px' color={item.type === 'broadcast' ? '#FF3B30' : '#0A84FF'} />
                </Avatar>
                {item.isRead === 0 ? <Badge dot className='notification-card__dot' /> : null}
              </View>
              <View className='mall-card-item__content'>
                <View className='mall-card-item__row'>
                  <View className='mall-card-item__title mall-text-ellipsis'>{item.title || '系统通知'}</View>
                  <View className='mall-card-item__meta'>{formatTime(item.createTime)}</View>
                </View>
                <View className='mall-card-item__desc mall-text-clamp-2'>{item.content || '暂无通知内容'}</View>
                {item.type ? <View className='notification-card__tag'>{item.type}</View> : null}
              </View>
            </View>
          ))}
        </View>
      )}
    </PageShell>
  )
}
