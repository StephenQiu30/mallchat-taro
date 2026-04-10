import { useState, useCallback } from 'react'
import { Input, Text, View, Image } from '@tarojs/components'
import { Search, Manager, Arrow } from '@taroify/icons'
import Taro, { useDidShow } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listFriends } from '@/api/chat/chatFriendController'
import { getOrCreatePrivateRoom } from '@/api/chat/chatRoomController'
import { Skeleton, Empty } from '@taroify/core'

import './index.scss'

export default function ContactIndex() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [friends, setFriends] = useState<ChatAPI.ChatFriendUserVO[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFriends = useCallback(async () => {
    if (!isLoggedIn) {
      // Not logged in — keep skeleton visible as placeholder
      setFriends([])
      return
    }
    setLoading(true)
    try {
      const res = await listFriends()
      if (res.code === 0 && res.data) {
        setFriends(res.data)
      }
    } catch (err) {
      console.error('Fetch friends failed:', err)
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  useDidShow(() => {
    fetchFriends()
  })

  const handleFriendClick = async (friend: ChatAPI.ChatFriendUserVO) => {
    try {
      Taro.showLoading({ title: '加载中...' })
      const res = await getOrCreatePrivateRoom({ peerUserId: friend.id! })
      if (res.code === 0 && res.data) {
        Taro.navigateTo({
          url: `/pages/chat/index?id=${res.data}&name=${encodeURIComponent(friend.userName || '')}`
        })
      }
    } catch (err) {
      console.error('Get private room failed:', err)
      Taro.showToast({ title: '打开聊天失败', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  }

  return (
    <View className='mall-page'>
      {/* Search */}
      <View className='ios-search'>
        <View className='ios-search__inner'>
          <Search size='16px' style={{ color: '#8E8E93' }} />
          <Input
            className='ios-search__input'
            placeholder='搜索联系人'
            placeholderStyle='color: #8E8E93;'
          />
        </View>
      </View>

      <View className='mall-page__body'>
        <View className='contact-body'>
          {/* Function entries card */}
          <View className='ios-card-group' style={{ marginTop: '16rpx' }}>
            <View
              className='ios-card-item'
              hoverClass='ios-card-item--pressed'
              onClick={() => Taro.navigateTo({ url: '/pages/contact/apply/index' })}
            >
              <View className='ios-card-item__icon mall-avatar mall-avatar--rounded mall-avatar--orange'>
                <Manager size='22px' />
              </View>
              <View className='ios-card-item__content'>
                <Text className='ios-card-item__title'>新朋友</Text>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <View className='mall-dot' style={{ marginRight: '16rpx' }} />
                  <Arrow size='16px' style={{ color: '#C7C7CC' }} />
                </View>
              </View>
            </View>
            <View
              className='ios-card-item'
              hoverClass='ios-card-item--pressed'
              onClick={() => Taro.navigateTo({ url: '/pages/contact/search/index' })}
            >
              <View className='ios-card-item__icon mall-avatar mall-avatar--rounded mall-avatar--blue'>
                <Search size='22px' />
              </View>
              <View className='ios-card-item__content last'>
                <Text className='ios-card-item__title'>搜索用户</Text>
                <Arrow size='16px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
          </View>

          {/* Friends list */}
          <Text className='contact-group-header'>我的好友</Text>
          <View className='friends-section'>
            {loading ? (
              <View style={{ padding: '0 32rpx', backgroundColor: '#fff' }}>
                {[1, 2, 3, 4].map(i => (
                  <View key={i} style={{ display: 'flex', padding: '24rpx 0', gap: '24rpx', borderBottom: '1rpx solid #f0f0f0' }}>
                    <Skeleton variant='rect' width='72rpx' height='72rpx' style={{ borderRadius: '12rpx' }} />
                    <View style={{ flex: 1, paddingTop: '16rpx' }}>
                      <Skeleton variant='rect' height='28rpx' width='40%' />
                    </View>
                  </View>
                ))}
              </View>
            ) : friends.length === 0 ? (
              <Empty>
                <Empty.Image src='default' />
                <Empty.Description>暂无好友</Empty.Description>
              </Empty>
            ) : (
              friends.map((friend) => (
                <View
                  key={friend.id}
                  className='mall-list-item'
                  onClick={() => handleFriendClick(friend)}
                >
                  <Image
                    src={friend.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${friend.id}`}
                    className='mall-avatar mall-avatar--rounded friend-item__avatar'
                    mode='aspectFill'
                  />
                  <View className='friend-item__main'>
                    <Text className='friend-item__name mall-text-ellipsis'>{friend.userName || '未知用户'}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </View>
  )
}
