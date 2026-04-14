import { useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { View } from '@tarojs/components'
import { UserOutlined, Search as SearchIcon, Plus } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listFriends } from '@/api/chat/chatFriendController'
import { Search, Cell, Avatar } from '@taroify/core'
import PageShell from '@/components/PageShell'
import ActionPill from '@/components/ActionPill'
import InsetCard from '@/components/InsetCard'
import ListStatus from '@/components/ListStatus'

import './index.scss'

const searchStyle = {
  '--search-background-color': '#F3F4F6',
  '--search-content-background-color': '#FFFFFF',
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
    <PageShell
      header={(
        <View className='mall-page-toolbar'>
          <Search
            placeholder='搜索联系人'
            value={keyword}
            onChange={(event) => setKeyword(event.detail.value)}
            onClear={() => setKeyword('')}
            style={searchStyle}
          />
          <ActionPill
            icon={<Plus size='18px' color='#0A84FF' />}
            text='添加'
            onClick={() => Taro.navigateTo({ url: '/pages/contact/search/index' })}
          />
        </View>
      )}
      contentClassName='mall-page__content--top-gap'
    >
      <InsetCard className='contact-card'>
        <Cell
          title='新的朋友'
          icon={<View className='contact-icon-box'><UserOutlined color='#0A84FF' /></View>}
          clickable
          onClick={() => Taro.navigateTo({ url: '/pages/contact/apply/index' })}
        />
        <Cell
          title='搜索发现'
          icon={<View className='contact-icon-box'><SearchIcon color='#0A84FF' /></View>}
          clickable
          onClick={() => Taro.navigateTo({ url: '/pages/contact/search/index' })}
        />
      </InsetCard>

      <View className='mall-section-title'>所有联系人</View>

      {!isLoggedIn ? (
        <ListStatus kind='login' description='登录后查看联系人列表' />
      ) : loading && listData.length === 0 ? (
        <ListStatus kind='loading' description='' skeletonRows={5} />
      ) : filteredFriends.length === 0 ? (
        <ListStatus kind='empty' description={keyword.trim() ? '未找到相关联系人' : '暂无好友'} />
      ) : (
        <InsetCard className='contact-card'>
          {filteredFriends.map((friend, idx) => (
            <Cell
              key={friend.id}
              title={friend.userName}
              brief={friend.onlineStatus === 1 ? '在线中，发起新的对话' : '保持联系，开始新的对话'}
              icon={
                <Avatar
                  className='mall-avatar'
                  src={friend.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${friend.id}`}
                  style={{ width: '84rpx', height: '84rpx', marginRight: '20rpx' }}
                />
              }
              clickable
              style={{ borderBottom: idx === filteredFriends.length - 1 ? 'none' : '1rpx solid var(--ios-separator)' }}
            />
          ))}
        </InsetCard>
      )}
    </PageShell>
  )
}
