import { useState, useCallback, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getRoomDetail, listRoomMembers, quitRoom, dismissRoom } from '@/api/chat/chatRoomController'
import { Avatar, Button, Cell } from '@taroify/core'
import ListStatus from '@/components/ListStatus'
import { Add } from '@taroify/icons'

import './index.scss'

export default function GroupDetail() {
  const router = useRouter()
  const { id: roomId } = router.params
  const { userInfo, isLoggedIn } = useSelector((state: RootState) => state.user)

  const [roomDetail, setRoomDetail] = useState<ChatAPI.ChatRoomVO | null>(null)
  const [members, setMembers] = useState<ChatAPI.ChatRoomMemberVO[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!roomId || !isLoggedIn) return
    setLoading(true)
    try {
      const [detailRes, membersRes] = await Promise.all([
        getRoomDetail({ roomId: Number(roomId) }),
        listRoomMembers({ roomId: Number(roomId) }),
      ])
      if (detailRes.code === 0 && detailRes.data) {
        setRoomDetail(detailRes.data)
      }
      if (membersRes.code === 0 && membersRes.data) {
        setMembers(membersRes.data)
      }
    } catch (err) {
      console.error('Fetch group detail failed:', err)
    } finally {
      setLoading(false)
    }
  }, [roomId, isLoggedIn])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const isOwner = roomDetail?.ownerUserId === userInfo?.id

  const handleInvite = () => {
    Taro.navigateTo({
      url: `/pages/contact/search/index?mode=invite&roomId=${roomId}`
    })
  }

  const handleQuit = () => {
    Taro.showModal({
      title: '退出群聊',
      content: '确定退出该群聊吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const quitRes = await quitRoom({ roomId: Number(roomId) })
            if (quitRes.code === 0) {
              Taro.showToast({ title: '已退出', icon: 'success' })
              setTimeout(() => {
                Taro.navigateBack()
              }, 1500)
            }
          } catch (err) {
            console.error('Quit room failed:', err)
          }
        }
      },
    })
  }

  const handleDismiss = () => {
    Taro.showModal({
      title: '解散群聊',
      content: '解散后所有成员将被移出群聊，确定解散吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const dismissRes = await dismissRoom({ roomId: Number(roomId) })
            if (dismissRes.code === 0) {
              Taro.showToast({ title: '已解散', icon: 'success' })
              setTimeout(() => {
                Taro.navigateBack()
              }, 1500)
            }
          } catch (err) {
            console.error('Dismiss room failed:', err)
          }
        }
      },
    })
  }

  if (!isLoggedIn) {
    return (
      <View className='mall-page'>
        <ListStatus kind='login' description='登录后查看群信息' />
      </View>
    )
  }

  if (loading) {
    return (
      <View className='mall-page'>
        <ListStatus kind='loading' description='' skeletonRows={5} />
      </View>
    )
  }

  if (!roomDetail) {
    return (
      <View className='mall-page'>
        <ListStatus kind='empty' description='未找到群信息' />
      </View>
    )
  }

  return (
    <View className='mall-page group-detail-page'>
      <View className='group-detail__header'>
        <Avatar
          className='mall-avatar'
          src={roomDetail.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${roomId}`}
          style={{ width: '120rpx', height: '120rpx' }}
        />
        <Text className='group-detail__name'>{roomDetail.name}</Text>
        <Text className='group-detail__count'>{roomDetail.memberCount}人</Text>
      </View>

      <View className='group-detail__section'>
        <Text className='group-detail__section-title'>群成员</Text>
        <View className='group-detail__members'>
          {members.map((member) => (
            <View key={member.userId} className='group-detail__member'>
              <Avatar
                className='mall-avatar mall-avatar--circle'
                src={member.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${member.userId}`}
                style={{ width: '80rpx', height: '80rpx' }}
              />
              <Text className='group-detail__member-name mall-text-ellipsis'>
                {member.userName || '未命名'}
              </Text>
              {member.role === 3 && <Text className='group-detail__role-tag'>群主</Text>}
              {member.role === 2 && <Text className='group-detail__role-tag'>管理员</Text>}
            </View>
          ))}
          <View className='group-detail__member group-detail__member--add' onClick={handleInvite}>
            <View className='group-detail__add-icon'>
              <Add size='24px' />
            </View>
            <Text className='group-detail__member-name'>邀请</Text>
          </View>
        </View>
      </View>

      {roomDetail.announcement && (
        <View className='group-detail__section'>
          <Text className='group-detail__section-title'>群公告</Text>
          <Text>{roomDetail.announcement}</Text>
        </View>
      )}

      <View className='group-detail__section'>
        <Cell.Group>
          <Cell>
            <Text>群名称</Text>
            <Text>{roomDetail.name}</Text>
          </Cell>
          <Cell>
            <Text>群人数</Text>
            <Text>{roomDetail.memberCount}人</Text>
          </Cell>
          <Cell>
            <Text>群主</Text>
            <Text>{members.find((m) => m.role === 3)?.userName || '未知'}</Text>
          </Cell>
        </Cell.Group>
      </View>

      <View className='group-detail__actions'>
        {isOwner ? (
          <Button color='danger' block shape='round' onClick={handleDismiss}>
            解散群聊
          </Button>
        ) : (
          <Button color='danger' block shape='round' onClick={handleQuit}>
            退出群聊
          </Button>
        )}
      </View>
    </View>
  )
}
