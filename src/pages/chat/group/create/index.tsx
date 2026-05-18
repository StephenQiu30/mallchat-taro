import { useState, useCallback, useEffect } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listFriends } from '@/api/chat/chatFriendController'
import { addChatRoom } from '@/api/chat/chatRoomController'
import { Avatar, Button, Checkbox } from '@taroify/core'
import ListStatus from '@/components/ListStatus'

import './index.scss'

export default function GroupCreate() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [friends, setFriends] = useState<ChatAPI.ChatFriendUserVO[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [groupName, setGroupName] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const fetchFriends = useCallback(async () => {
    if (!isLoggedIn) return
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

  useEffect(() => {
    fetchFriends()
  }, [fetchFriends])

  const toggleSelect = (userId: number) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleCreate = async () => {
    const name = groupName.trim()
    if (!name) {
      Taro.showToast({ title: '请输入群名称', icon: 'none' })
      return
    }
    if (selectedIds.length === 0) {
      Taro.showToast({ title: '请选择群成员', icon: 'none' })
      return
    }

    setCreating(true)
    try {
      const res = await addChatRoom({
        name,
        memberIds: selectedIds,
      })
      if (res.code === 0 && res.data) {
        Taro.showToast({ title: '创建成功', icon: 'success' })
        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/chat/index?id=${res.data}&name=${encodeURIComponent(name)}`
          })
        }, 1500)
      }
    } catch (err) {
      console.error('Create group failed:', err)
      Taro.showToast({ title: '创建失败', icon: 'none' })
    } finally {
      setCreating(false)
    }
  }

  return (
    <View className='mall-page group-create-page'>
      <View className='mall-page__header'>
        <Text className='mall-page__title'>创建群聊</Text>
      </View>

      <View className='group-create__form'>
        <View className='group-create__field'>
          <Text className='group-create__label'>群名称</Text>
          <Input
            className='group-create__input'
            placeholder='请输入群名称'
            value={groupName}
            onInput={(e) => setGroupName(e.detail.value)}
            maxlength={20}
          />
        </View>

        <View className='group-create__field'>
          <Text className='group-create__label'>选择成员 ({selectedIds.length}人)</Text>
        </View>
      </View>

      <View className='group-create__list'>
        {!isLoggedIn ? (
          <ListStatus kind='login' description='登录后选择好友' />
        ) : loading ? (
          <ListStatus kind='loading' description='' skeletonRows={5} />
        ) : friends.length === 0 ? (
          <ListStatus kind='empty' description='暂无好友，先去添加好友吧' />
        ) : (
          friends.map((friend) => {
            const isSelected = selectedIds.includes(friend.id!)
            return (
              <View
                key={friend.id}
                className={`group-create__item ${isSelected ? 'group-create__item--selected' : ''}`}
                onClick={() => toggleSelect(friend.id!)}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleSelect(friend.id!)}
                  style={{ marginRight: '24rpx' }}
                />
                <Avatar
                  className='mall-avatar mall-avatar--circle'
                  src={friend.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${friend.id}`}
                  style={{ width: '80rpx', height: '80rpx', marginRight: '24rpx' }}
                />
                <Text className='group-create__name'>{friend.userName || '未命名'}</Text>
              </View>
            )
          })
        )}
      </View>

      <View className='group-create__footer'>
        <Button
          color='primary'
          block
          shape='round'
          onClick={handleCreate}
          loading={creating}
          disabled={selectedIds.length === 0 || !groupName.trim()}
        >
          创建群聊 ({selectedIds.length}人)
        </Button>
      </View>
    </View>
  )
}
