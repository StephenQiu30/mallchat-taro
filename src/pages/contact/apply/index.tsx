import { useState, useCallback } from 'react'
import { Text, View, Image } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listFriendApply, approveFriend } from '@/api/chat/chatFriendApplyController'
import { Skeleton, Empty, Button } from '@taroify/core'

import './index.scss'

export default function FriendApplyIndex() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [applyList, setApplyList] = useState<ChatAPI.ChatFriendApplyVO[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApplyList = useCallback(async () => {
    if (!isLoggedIn) {
      setApplyList([])
      setLoading(false)
      Taro.stopPullDownRefresh()
      return
    }

    setLoading(true)
    try {
      const res = await listFriendApply({ current: 1, pageSize: 50 })
      if (res.code === 0 && res.data?.records) {
        setApplyList(res.data.records)
      }
    } catch (err) {
      console.error('Fetch friend apply failed:', err)
    } finally {
      setLoading(false)
      Taro.stopPullDownRefresh()
    }
  }, [isLoggedIn])

  useDidShow(() => {
    fetchApplyList()
  })

  usePullDownRefresh(() => {
    fetchApplyList()
  })

  const handleApprove = async (applyId: number, status: number) => {
    try {
      Taro.showLoading({ title: status === 2 ? '同意中...' : '拒绝中...' })
      const res = await approveFriend({ applyId, status })
      if (res.code === 0) {
        setApplyList((prev) => prev.map((item) => (
          item.id === applyId ? { ...item, status } : item
        )))
        Taro.showToast({
          title: status === 2 ? '已同意' : '已拒绝',
          icon: 'success'
        })
        fetchApplyList()
      }
    } catch (err) {
      console.error('Approve failed:', err)
    } finally {
      Taro.hideLoading()
    }
  }

  const getStatusLabel = (status?: number) => {
    if (status === 2) return '已同意'
    if (status === 3) return '已拒绝'
    return ''
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
    } catch {
      return timeStr
    }
  }

  return (
    <View className='mall-page'>
      <View className='mall-page__body'>
        <View className='apply-list'>
          {!isLoggedIn ? (
            <Empty style={{ marginTop: '20vh' }}>
              <Empty.Description>登录后查看好友申请</Empty.Description>
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
          ) : loading && applyList.length === 0 ? (
            <View style={{ padding: '0 32rpx' }}>
              {[1, 2, 3, 4].map(i => (
                <View key={i} style={{ padding: '24rpx 0' }}>
                  <Skeleton avatar title row={2} loading />
                </View>
              ))}
            </View>
          ) : applyList.length === 0 ? (
            <Empty>
              <Empty.Image src='default' />
              <Empty.Description>暂无好友申请</Empty.Description>
            </Empty>
          ) : (
            applyList.map((item) => (
              <View key={item.id} className='apply-item'>
                <Image
                  src={item.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${item.userId}`}
                  className='mall-avatar mall-avatar--rounded apply-item__avatar'
                />
                <View className='apply-item__main'>
                  <View className='apply-item__row'>
                    <Text className='apply-item__name'>{item.userName || '未知用户'}</Text>
                    <Text className='apply-item__time'>{formatTime(item.createTime)}</Text>
                  </View>
                  <Text className='apply-item__msg'>{item.msg || '请求添加你为好友'}</Text>
                </View>
                <View className='apply-item__actions'>
                  {item.status === 1 ? (
                    <>
                      <View
                        className='apply-btn apply-btn--accept'
                        hoverClass='apply-btn--pressed'
                        onClick={() => handleApprove(item.id!, 2)}
                      >
                        <Text className='apply-btn__label'>同意</Text>
                      </View>
                      <View
                        className='apply-btn apply-btn--reject'
                        hoverClass='apply-btn--pressed'
                        onClick={() => handleApprove(item.id!, 3)}
                      >
                        <Text className='apply-btn__label apply-btn__label--reject'>拒绝</Text>
                      </View>
                    </>
                  ) : (
                    <Text className='apply-item__status'>{getStatusLabel(item.status)}</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  )
}
