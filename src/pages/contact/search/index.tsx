import { useState, useRef, useCallback } from 'react'
import { Input, Text, View, Image } from '@tarojs/components'
import { Search } from '@taroify/icons'
import Taro from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listUserVoByPage } from '@/api/user/userController'
import { applyFriend } from '@/api/chat/chatFriendApplyController'
import { Skeleton, Empty } from '@taroify/core'

import './index.scss'

export default function UserSearchIndex() {
  const { userInfo } = useSelector((state: RootState) => state.user)
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState<UserAPI.UserVO[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout>()

  const doSearch = useCallback(async (keyword: string) => {
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
  }, [userInfo?.id])

  const handleInput = (e) => {
    const val = e.detail.value
    setSearchText(val)
    // Debounce 500ms
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      doSearch(val)
    }, 500)
  }

  const handleAddFriend = (user: UserAPI.UserVO) => {
    Taro.showModal({
      title: `添加 ${user.userName || '用户'}`,
      placeholderText: '你好，我想加你为好友',
      editable: true,
      success: async (res) => {
        if (res.confirm) {
          try {
            Taro.showLoading({ title: '发送中...' })
            const applyRes = await applyFriend({
              targetId: user.id!,
              msg: res.content || '你好，我想加你为好友'
            })
            if (applyRes.code === 0) {
              Taro.showToast({ title: '申请已发送', icon: 'success' })
            }
          } catch (err) {
            console.error('Apply friend failed:', err)
          } finally {
            Taro.hideLoading()
          }
        }
      }
    })
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
            focus
          />
        </View>
      </View>

      <View className='mall-page__body'>
        <View className='search-results'>
          {loading ? (
            <View style={{ padding: '0 32rpx' }}>
              {[1, 2, 3].map(i => (
                <View key={i} style={{ display: 'flex', padding: '24rpx 0', gap: '24rpx' }}>
                  <Skeleton variant='circle' width='96rpx' height='96rpx' />
                  <View style={{ flex: 1, paddingTop: '10rpx' }}>
                    <Skeleton variant='rect' height='32rpx' width='40%' style={{ marginBottom: '16rpx' }} />
                    <Skeleton variant='rect' height='24rpx' width='60%' />
                  </View>
                </View>
              ))}
            </View>
          ) : searched && results.length === 0 ? (
            <Empty style={{ marginTop: '100rpx' }}>
              <Empty.Image src='search' />
              <Empty.Description>未找到匹配用户</Empty.Description>
            </Empty>
          ) : !searched ? (
            <View className='search-hint'>
              <Text className='search-hint__text'>输入关键词搜索用户</Text>
            </View>
          ) : (
            results.map((user) => (
              <View
                key={user.id}
                className='search-user-item'
                hoverClass='search-user-item--pressed'
                hoverStayTime={80}
              >
                <Image
                  src={user.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`}
                  className='search-user-item__avatar'
                />
                <View className='search-user-item__main'>
                  <Text className='search-user-item__name'>{user.userName || '未知用户'}</Text>
                  {user.userProfile && (
                    <Text className='search-user-item__desc'>{user.userProfile}</Text>
                  )}
                </View>
                <View
                  className='search-user-item__add-btn'
                  hoverClass='search-user-item__add-btn--pressed'
                  onClick={() => handleAddFriend(user)}
                >
                  <Text className='search-user-item__add-label'>添加</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  )
}
