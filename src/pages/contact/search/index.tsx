import { useState, useRef, useCallback } from 'react'
import { Input, Text, View, Image } from '@tarojs/components'
import { Search } from '@taroify/icons'
import Taro from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listUserVoByPage } from '@/api/user/userController'
import { applyFriend } from '@/api/chat/chatFriendApplyController'
import { Skeleton, Empty, Button } from '@taroify/core'

import './index.scss'

export default function UserSearchIndex() {
  const { userInfo, isLoggedIn } = useSelector((state: RootState) => state.user)
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState<UserAPI.UserVO[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [pendingIds, setPendingIds] = useState<number[]>([])
  const [applyingId, setApplyingId] = useState<number>()
  const debounceTimer = useRef<NodeJS.Timeout>()

  const doSearch = useCallback(async (keyword: string) => {
    if (!isLoggedIn) {
      setResults([])
      setSearched(false)
      return
    }

    if (!keyword.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await listUserVoByPage({
        searchText: keyword.trim(),
        current: 1,
        pageSize: 20,
        notId: userInfo?.id // Exclude self
      })
      if (res.code === 0 && res.data?.records) {
        setResults(res.data.records)
      }
    } catch (err) {
      console.error('Search users failed:', err)
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn, userInfo?.id])

  const handleInput = (e) => {
    const val = e.detail.value
    setSearchText(val)

    if (!isLoggedIn) {
      return
    }

    // Debounce 500ms
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      doSearch(val)
    }, 500)
  }

  const handleAddFriend = async (user: UserAPI.UserVO) => {
    if (!isLoggedIn) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      Taro.switchTab({ url: '/pages/profile/index' })
      return
    }

    if (!user.id || pendingIds.includes(user.id) || applyingId === user.id) {
      return
    }

    const res = await Taro.showModal({
      title: `添加 ${user.userName || '用户'}`,
      content: '确认发送好友申请吗？',
      editable: true,
    } as any) as Taro.showModal.SuccessCallbackResult & { content?: string }

    if (!res.confirm) {
      return
    }

    try {
      setApplyingId(user.id)
      Taro.showLoading({ title: '发送中...' })
      const applyRes = await applyFriend({
        targetId: user.id,
        msg: res.content?.trim() || '你好，我想加你为好友',
      })
      if (applyRes.code === 0) {
        setPendingIds((prev) => [...prev, user.id!])
        Taro.showToast({ title: '申请已发送', icon: 'success' })
      }
    } catch (err) {
      console.error('Apply friend failed:', err)
    } finally {
      setApplyingId(undefined)
      Taro.hideLoading()
    }
  }

  return (
    <View className='mall-page'>
      {/* Search bar */}
      <View className='ios-search'>
        <View className='ios-search__inner'>
          <Search size='16px' style={{ color: '#8E8E93' }} />
          <Input
            className='ios-search__input'
            placeholder='输入用户名搜索'
            placeholderStyle='color: #8E8E93;'
            value={searchText}
            onInput={handleInput}
            focus={isLoggedIn}
            disabled={!isLoggedIn}
          />
        </View>
      </View>

      <View className='mall-page__body'>
        <View className='search-results'>
          {!isLoggedIn ? (
            <Empty style={{ marginTop: '20vh' }}>
              <Empty.Description>登录后搜索并添加好友</Empty.Description>
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
          ) : loading ? (
            <View style={{ padding: '0 32rpx' }}>
              {[1, 2, 3].map(i => (
                <View key={i} style={{ padding: '24rpx 0' }}>
                  <Skeleton avatar title row={2} loading />
                </View>
              ))}
            </View>
          ) : searched && results.length === 0 ? (
            <Empty>
              <Empty.Image src='search' />
              <Empty.Description>未找到相关用户</Empty.Description>
            </Empty>
          ) : !searched ? (
            <View className='search-hint'>
              <Text className='search-hint__text'>输入关键词搜索用户</Text>
            </View>
          ) : (
            results.map((user) => (
              <View key={user.id} className='search-user-item' hoverClass='search-user-item--pressed' hoverStayTime={80}>
                <Image
                  src={user.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`}
                  className='mall-avatar mall-avatar--rounded search-user-item__avatar'
                />
                <View className='search-user-item__main'>
                  <Text className='search-user-item__name'>{user.userName || '未知用户'}</Text>
                  {user.userProfile && (
                    <Text className='search-user-item__desc'>{user.userProfile}</Text>
                  )}
                </View>
                <View
                  className={`search-user-item__add-btn ${pendingIds.includes(user.id || 0) ? 'search-user-item__add-btn--disabled' : ''}`}
                  hoverClass={pendingIds.includes(user.id || 0) ? undefined : 'search-user-item__add-btn--pressed'}
                  onClick={() => handleAddFriend(user)}
                >
                  <Text className='search-user-item__add-label'>
                    {pendingIds.includes(user.id || 0)
                      ? '已申请'
                      : applyingId === user.id
                        ? '发送中'
                        : '添加'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  )
}
