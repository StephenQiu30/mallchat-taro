import { useEffect, useState, useCallback, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Input, ScrollView, Text, View, Image } from '@tarojs/components'
import { Plus, Photo, DescriptionOutlined } from '@taroify/icons'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listHistoryMessages, sendMessage, markMessageRead, recallMessage } from '@/api/chat/chatMessageController'
import { Skeleton, Empty, Avatar, Button } from '@taroify/core'

import './index.scss'

const primaryButtonStyle = {
  '--button-primary-background-color': 'var(--ios-blue)',
} as CSSProperties

export default function ChatDetail() {
  const router = useRouter()
  const { id: roomId, name: roomName } = router.params
  const { userInfo, isLoggedIn } = useSelector((state: RootState) => state.user)
  
  const [messages, setMessages] = useState<ChatAPI.ChatMessageVO[]>([])
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [scrollIntoView, setScrollIntoView] = useState('')
  const [sending, setSending] = useState(false)
  
  const pollingTimer = useRef<NodeJS.Timeout>()

  const markRead = useCallback(async (msgs: ChatAPI.ChatMessageVO[]) => {
    if (!roomId || msgs.length === 0) return
    const lastMsg = msgs[msgs.length - 1]
    if (lastMsg?.id) {
      try {
        await markMessageRead({
          roomId: Number(roomId),
          lastReadMessageId: lastMsg.id
        })
      } catch (err) {
        console.error('Mark read failed:', err)
      }
    }
  }, [roomId])

  const fetchMessages = useCallback(async (isSilent = false) => {
    if (!roomId || !isLoggedIn) {
      setMessages([])
      setLoading(false)
      return
    }
    
    if (!isSilent) setLoading(true)
    try {
      const res = await listHistoryMessages({
        roomId: Number(roomId),
        limit: 50
      })
      if (res.code === 0 && res.data) {
        const sortedMsgs = [...(res.data || [])].sort((a, b) => 
          new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime()
        )
        setMessages(sortedMsgs)
        await markRead(sortedMsgs)
      }
    } catch (err) {
      console.error('Fetch messages failed:', err)
    } finally {
      setLoading(false)
    }
  }, [roomId, isLoggedIn, markRead])

  useEffect(() => {
    if (roomName) {
      Taro.setNavigationBarTitle({ title: decodeURIComponent(roomName) })
    }
    fetchMessages()

    if (!roomId || !isLoggedIn) {
      return
    }

    pollingTimer.current = setInterval(() => {
      fetchMessages(true)
    }, 5000)

    return () => {
      if (pollingTimer.current) clearInterval(pollingTimer.current)
    }
  }, [roomId, roomName, isLoggedIn, fetchMessages])

  useEffect(() => {
    if (messages.length > 0) {
      const lastId = messages[messages.length - 1].id
      setTimeout(() => {
        setScrollIntoView(`msg-${lastId}`)
      }, 200)
    }
  }, [messages])

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text || sending || !roomId || !isLoggedIn) return

    setSending(true)
    try {
      const res = await sendMessage({
        roomId: Number(roomId),
        content: text,
        type: 1
      })
      
      if (res.code === 0) {
        setInputValue('')
        await fetchMessages(true)
      }
    } catch (err) {
      console.error('Send message failed:', err)
      Taro.showToast({ title: '发送失败', icon: 'none' })
    } finally {
      setSending(false)
    }
  }

  const handleRecall = async (id: number) => {
    try {
      const res = await recallMessage({ id })
      if (res.code === 0) {
        Taro.showToast({ title: '已撤回', icon: 'success' })
        fetchMessages(true)
      }
    } catch (e) {
      Taro.showToast({ title: '撤回失败', icon: 'none' })
    }
  }

  const canRecallMessage = (msg: ChatAPI.ChatMessageVO, isMe: boolean) => {
    if (!isMe || msg.status === 1 || !msg.createTime) {
      return false
    }

    return Date.now() - new Date(msg.createTime).getTime() <= 2 * 60 * 1000
  }

  const handleMessageLongPress = (msg: ChatAPI.ChatMessageVO, isMe: boolean) => {
    if (!isMe || msg.status === 1) {
      return
    }

    if (!canRecallMessage(msg, isMe)) {
      Taro.showToast({ title: '仅支持 2 分钟内撤回', icon: 'none' })
      return
    }

    handleRecall(msg.id!)
  }

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return ''
    const date = new Date(timeStr.replace(/-/g, '/'))
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const renderMessageContent = (msg: ChatAPI.ChatMessageVO, isMe: boolean) => {
    if (msg.status === 1) {
      return <Text style={{ fontSize: '24rpx', color: 'var(--ios-text-tertiary)', fontStyle: 'italic' }}>消息已撤回</Text>
    }

    switch (msg.type) {
      case 2:
        return <Image src={msg.content || ''} mode='widthFix' style={{ width: '100%', borderRadius: '24rpx' }} showMenuByLongpress />
      case 3:
        return (
          <View style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
            <DescriptionOutlined size='24px' color={isMe ? '#fff' : 'var(--ios-blue)'} />
            <Text className='mall-text-ellipsis' style={{ fontSize: '28rpx', color: isMe ? '#fff' : 'inherit' }}>{msg.content}</Text>
          </View>
        )
      default:
        return <Text style={{ fontSize: '30rpx', lineHeight: 1.5, color: isMe ? '#fff' : 'inherit' }}>{msg.content}</Text>
    }
  }

  return (
    <View className='mall-page'>
      <ScrollView
        scrollY
        enhanced
        scrollWithAnimation
        className='mall-page__body'
        scrollIntoView={scrollIntoView}
      >
        <View style={{ padding: '32rpx' }}>
          {!isLoggedIn ? (
            <Empty style={{ marginTop: '20vh' }}>
              <Empty.Description>登录后查看聊天内容</Empty.Description>
            </Empty>
          ) : !roomId ? (
            <Empty style={{ marginTop: '20vh' }}>
              <Empty.Description>未找到当前会话</Empty.Description>
            </Empty>
          ) : loading && messages.length === 0 ? (
            <View>
              <Skeleton avatar title row={1} loading style={{ marginBottom: '32rpx' }} />
              <Skeleton avatar title row={1} loading style={{ marginBottom: '32rpx' }} />
            </View>
          ) : messages.length === 0 ? (
            <Empty style={{ marginTop: '20vh' }}>
              <Empty.Description>暂无消息，开始聊天吧</Empty.Description>
            </Empty>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.fromUserId === userInfo?.id
              const prevMsg = messages[index - 1]
              const showUser = !prevMsg || prevMsg.fromUserId !== msg.fromUserId
              
              return (
                <View
                  id={`msg-${msg.id}`}
                  key={msg.id}
                  className={`chat-message ${isMe ? 'chat-message--mine' : ''} ${!showUser ? 'chat-message--collapsed' : ''}`}
                  onLongPress={() => handleMessageLongPress(msg, isMe)}
                >
                  {showUser && !isMe && (
                    <Avatar 
                      className='mall-avatar'
                      src={msg.fromUserAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.fromUserId}`} 
                      style={{ width: '72rpx', height: '72rpx', flexShrink: 0, marginTop: '12rpx' }}
                    />
                  )}
                  {(!showUser || isMe) && !isMe && <View style={{ width: '72rpx' }} />}

                  <View className='chat-message__body' style={{ margin: isMe ? '0 0 0 0' : '0 0 0 16rpx', maxWidth: '75%' }}>
                    {!isMe && showUser && <Text style={{ fontSize: '22rpx', color: 'var(--ios-text-tertiary)', marginBottom: '4rpx', marginLeft: '12rpx' }}>{msg.fromUserName}</Text>}
                    <View 
                      className={`chat-bubble ${isMe ? 'chat-bubble--mine' : 'chat-bubble--other'}`}
                    >
                      {renderMessageContent(msg, isMe)}
                    </View>
                    {showUser && (
                      <View style={{ marginTop: '8rpx', display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <Text style={{ fontSize: '20rpx', color: 'var(--ios-text-tertiary)' }}>{formatTime(msg.createTime)}</Text>
                      </View>
                    )}
                  </View>

                  {showUser && isMe && (
                    <Avatar 
                      className='mall-avatar'
                      src={msg.fromUserAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.fromUserId}`} 
                      style={{ width: '72rpx', height: '72rpx', flexShrink: 0, marginTop: '12rpx', marginLeft: '16rpx' }}
                    />
                  )}
                  {(!showUser || !isMe) && isMe && <View style={{ width: '72rpx', marginLeft: '16rpx' }} />}
                </View>
              )
            })
          )}
          <View style={{ height: '32rpx' }} />
        </View>
      </ScrollView>

      <View className='chat-page__composer'>
        <View className='chat-page__composer-inner'>
          <View className='chat-page__input-shell'>
            <Input
              className='chat-page__input-field'
              placeholder='输入内容...'
              value={inputValue}
              onInput={e => setInputValue(e.detail.value)}
              onConfirm={handleSend}
              confirmType='send'
              adjustPosition
              disabled={sending || !isLoggedIn || !roomId}
            />
          </View>

          <View className='chat-page__actions'>
            {inputValue.trim() ? (
              <Button color='primary' size='small' shape='round' onClick={handleSend} loading={sending} style={primaryButtonStyle}>
                发送
              </Button>
            ) : (
              <View className='action-icons'>
                <Photo size='24px' color='var(--ios-text-tertiary)' />
                <Plus size='24px' color='var(--ios-text-tertiary)' />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}
