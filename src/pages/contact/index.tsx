import { useState, useCallback } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { UserOutlined, Search as SearchIcon, Plus } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listFriends } from '@/api/chat/chatFriendController'
import { Skeleton, Empty, Search, Cell, Avatar } from '@taroify/core'

import './index.scss'

export default function ContactPage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [listData, setListData] = useState<ChatAPI.ChatFriendUserVO[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFriends = useCallback(async (isSilent = false) => {
    if (!isLoggedIn) {
      setListData([])
      Taro.stopPullDownRefresh()
      return
    }
    
    if (!isSilent) setLoading(true)
    try {
      const res = await listFriends()
      if (res.code === 0 && res.data) {
        setListData(res.data)
      }
    } catch (err) {
      console.error('Fetch friends failed:', err)
    } finally {
      setLoading(false)
      Taro.stopPullDownRefresh()
    }
  }, [isLoggedIn])

  useDidShow(() => {
    fetchFriends(listData.length > 0)
  })

  usePullDownRefresh(() => {
    fetchFriends()
  })

  return (
    <View className='mall-page'>
      <View className='ios-glass-header'>
        <View className='search-container' style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
          <View style={{ flex: 1 }}>
            <Search 
              placeholder='搜索联系人' 
              style={{ 
                '--search-background-color': '#E9E9EB',
                '--search-padding': '8rpx 16rpx',
                '--search-input-height': '72rpx'
              }} 
            />
          </View>
          <View className='icon-btn' style={{ width: '72rpx', height: '72rpx' }}>
            <Plus size='20px' color='var(--ios-blue)' />
          </View>
        </View>
      </View>

      <ScrollView scrollY className='mall-page__body'>
        {/* Entry Groups */}
        <View className='ios-card-group'>
          <Cell 
            title='新的朋友' 
            icon={<View className='icon-box orange'><UserOutlined color='#fff' /></View>} 
            clickable
            onClick={() => Taro.navigateTo({ url: '/pages/contact/apply/index' })}
          />
          <Cell 
            title='搜索发现' 
            icon={<View className='icon-box blue'><SearchIcon color='#fff' /></View>} 
            clickable
            onClick={() => Taro.navigateTo({ url: '/pages/contact/search/index' })}
          />
        </View>

        <View className='ios-group-title'>所有联系人</View>

        {loading && listData.length === 0 ? (
          <View style={{ padding: '32rpx' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={{ display: 'flex', marginBottom: '32rpx', gap: '24rpx' }}>
                <Skeleton variant='circle' width='80rpx' height='80rpx' />
                <View style={{ flex: 1, paddingTop: '16rpx' }}>
                  <Skeleton variant='rect' height='32rpx' width='40%' />
                </View>
              </View>
            ))}
          </View>
        ) : listData.length === 0 ? (
          <Empty style={{ marginTop: '10vh' }}>
            <Empty.Description>暂无好友</Empty.Description>
          </Empty>
        ) : (
          <View className='ios-card-group'>
            {listData.map((friend, idx) => (
              <Cell
                key={friend.id}
                title={friend.userName}
                icon={
                  <Avatar 
                    className='mall-avatar'
                    src={friend.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${friend.id}`} 
                    style={{ width: '80rpx', height: '80rpx', marginRight: '24rpx' }}
                  />
                }
                clickable
                style={{ borderBottom: idx === listData.length - 1 ? 'none' : '1rpx solid var(--ios-separator)' }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
