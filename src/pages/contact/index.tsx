import { useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { UserOutlined, Search as SearchIcon, Plus } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listFriends } from '@/api/chat/chatFriendController'
import { Skeleton, Empty, Search, Cell, Avatar, Button } from '@taroify/core'

import './index.scss'

const searchStyle = {
  '--search-background-color': '#E9E9EB',
  '--search-padding': '8rpx 16rpx',
  '--search-input-height': '72rpx',
} as CSSProperties

export default function ContactPage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [listData, setListData] = useState<ChatAPI.ChatFriendUserVO[]>([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchFriends = useCallback(async (isSilent = false) => {
    if (!isLoggedIn) {
      setListData([])
      setLoading(false)
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

  const filteredFriends = listData.filter((friend) => {
    return (friend.userName || '').toLowerCase().includes(keyword.trim().toLowerCase())
  })

  return (
    <View className='mall-page'>
      <View className='ios-glass-header'>
        <View className='search-container' style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
          <View style={{ flex: 1 }}>
            <Search 
              placeholder='搜索联系人' 
              value={keyword}
              onChange={(event) => setKeyword(event.detail.value)}
              onClear={() => setKeyword('')}
              style={searchStyle}
            />
          </View>
          <View
            className='icon-btn'
            style={{ width: '72rpx', height: '72rpx' }}
            onClick={() => Taro.navigateTo({ url: '/pages/contact/search/index' })}
          >
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

        {!isLoggedIn ? (
          <Empty style={{ marginTop: '20vh' }}>
            <Empty.Description>登录后查看联系人列表</Empty.Description>
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
                <Skeleton avatar title row={1} loading />
              </View>
            ))}
          </View>
        ) : filteredFriends.length === 0 ? (
          <Empty style={{ marginTop: '10vh' }}>
            <Empty.Description>{keyword.trim() ? '未找到相关联系人' : '暂无好友'}</Empty.Description>
          </Empty>
        ) : (
          <View className='ios-card-group'>
            {filteredFriends.map((friend, idx) => (
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
                style={{ borderBottom: idx === filteredFriends.length - 1 ? 'none' : '1rpx solid var(--ios-separator)' }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
