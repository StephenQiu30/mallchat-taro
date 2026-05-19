import { useState, useCallback, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { View, Text } from '@tarojs/components'
import { UserOutlined, Search as SearchIcon, Plus } from '@taroify/icons'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listFriends } from '@/api/chat/chatFriendController'
import { Search, Cell, Avatar, Badge } from '@taroify/core'
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

interface FriendGroup {
  letter: string
  friends: ChatAPI.ChatFriendUserVO[]
}

export default function ContactPage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [listData, setListData] = useState<ChatAPI.ChatFriendUserVO[]>([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

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

  const friendGroups = useMemo(() => {
    const groups: FriendGroup[] = []
    const groupMap = new Map<string, ChatAPI.ChatFriendUserVO[]>()

    filteredFriends.forEach((friend) => {
      const name = friend.userName || '未命名'
      const firstChar = name.charAt(0).toUpperCase()
      const letter = /[A-Z]/.test(firstChar) ? firstChar : '#'

      if (!groupMap.has(letter)) {
        groupMap.set(letter, [])
      }
      groupMap.get(letter)!.push(friend)
    })

    const sortedKeys = Array.from(groupMap.keys()).sort((a, b) => {
      if (a === '#') return 1
      if (b === '#') return -1
      return a.localeCompare(b)
    })

    sortedKeys.forEach((letter) => {
      groups.push({ letter, friends: groupMap.get(letter)! })
    })

    return groups
  }, [filteredFriends])

  const toggleGroup = (letter: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(letter)) {
        next.delete(letter)
      } else {
        next.add(letter)
      }
      return next
    })
  }

  const handleFriendClick = (friend: ChatAPI.ChatFriendUserVO) => {
    Taro.navigateTo({
      url: `/pages/chat/index?id=${friend.id || 0}&name=${encodeURIComponent(friend.userName || '')}`
    })
  }

  return (
    <PageShell
      header={(
        <View className='contact-header-wrap'>
          <View className='contact-header'>
            <View className='contact-header__spacer' />
            <View className='contact-header__title'>联系人</View>
            <View className='contact-header__add' onClick={() => Taro.navigateTo({ url: '/pages/contact/search/index' })}>
              <Plus size='20px' color='#344054' />
            </View>
          </View>
          <View className='mall-page-toolbar contact-toolbar'>
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
          title='群通知'
          icon={<View className='contact-icon-box contact-icon-box--group'><UserOutlined color='#0A84FF' /></View>}
          rightIcon={<Badge content='1' />}
          clickable
          onClick={() => Taro.navigateTo({ url: '/pages/notification/index' })}
        />
        <Cell
          title='搜索发现'
          icon={<View className='contact-icon-box'><SearchIcon color='#0A84FF' /></View>}
          clickable
          onClick={() => Taro.navigateTo({ url: '/pages/contact/search/index' })}
        />
      </InsetCard>

      <View className='mall-section-title'>好友分组</View>

      {!isLoggedIn ? (
        <ListStatus kind='login' description='登录后查看联系人列表' />
      ) : loading && listData.length === 0 ? (
        <ListStatus kind='loading' description='' skeletonRows={5} />
      ) : filteredFriends.length === 0 ? (
        <ListStatus kind='empty' description={keyword.trim() ? '未找到相关联系人' : '暂无好友'} />
      ) : (
        <View className='contact-groups'>
          {friendGroups.map((group) => (
            <InsetCard key={group.letter} className='contact-card'>
              <View className='contact-group__header' onClick={() => toggleGroup(group.letter)}>
                <Text className='contact-group__arrow'>
                  {collapsedGroups.has(group.letter) ? '▶' : '▼'}
                </Text>
                <Text className='contact-group__letter'>{group.letter}</Text>
                <Text className='contact-group__count'>
                  {group.friends.length}人
                </Text>
              </View>
              {!collapsedGroups.has(group.letter) && group.friends.map((friend) => (
                <Cell
                  key={friend.id}
                  title={friend.userName}
                  brief={friend.onlineStatus === 1 ? '在线中' : '离线'}
                  icon={
                    <Avatar
                      className='mall-avatar'
                      src={friend.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${friend.id}`}
                      style={{ width: '84rpx', height: '84rpx', marginRight: '20rpx' }}
                    />
                  }
                  clickable
                  onClick={() => handleFriendClick(friend)}
                />
              ))}
            </InsetCard>
          ))}
        </View>
      )}
    </PageShell>
  )
}
