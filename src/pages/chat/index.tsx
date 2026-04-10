import { useEffect, useState, useCallback, useRef } from 'react'
import { Input, ScrollView, Text, View } from '@tarojs/components'
import { Plus, Photo, DescriptionOutlined } from '@taroify/icons'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listHistoryMessages, sendMessage, markMessageRead, recallMessage } from '@/api/chat/chatMessageController'
import { Skeleton, Empty, Avatar, Button } from '@taroify/core'

import './index.scss'

export default function ChatDetail() {
  const router = useRouter()
  const { id: roomId, name: roomName } = router.params
  const { userInfo } = useSelector((state: RootState) => state.user)
  
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
    if (!roomId) return
    
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
        markRead(sortedMsgs)
      }
    } catch (err) {
      console.error('Fetch messages failed:', err)
    } finally {
      setLoading(false)
    }
  }, [roomId, markRead])

  useEffect(() => {
    if (roomName) {
      Taro.setNavigationBarTitle({ title: decodeURIComponent(roomName) })
    }
    fetchMessages()
    
    pollingTimer.current = setInterval(() => {
      fetchMessages(true)
    }, 5000)

    return () => {
      if (pollingTimer.current) clearInterval(pollingTimer.current)
    }
  }, [roomId, roomName, fetchMessages])

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
    if (!text || sending || !roomId) return

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
        return <Taro.Image src={msg.content || ''} mode='widthFix' style={{ width: '100%', borderRadius: '24rpx' }} showMenuByLongpress />
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
          {loading && messages.length === 0 ? (
            <View>
              <Skeleton variant='rect' height='80rpx' width='60%' style={{ marginBottom: '32rpx', borderRadius: '12rpx' }} />
              <Skeleton variant='rect' height='80rpx' width='40%' style={{ alignSelf: 'flex-end', marginBottom: '32rpx', borderRadius: '12rpx' }} />
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
                  onLongPress={() => isMe && msg.status !== 1 && handleRecall(msg.id!)}
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
              disabled={sending}
            />
          </View>

          <View className='chat-page__actions'>
            {inputValue.trim() ? (
              <Button color='primary' size='small' shape='round' onClick={handleSend} loading={sending} style={{ '--button-primary-background-color': 'var(--ios-blue)' }}>发送</Button>
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
