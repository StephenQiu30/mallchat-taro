import { useEffect, useState, useCallback, useRef } from 'react'
import { Input, ScrollView, Text, View, Image } from '@tarojs/components'
import { Audio, Plus, SmileOutlined } from '@taroify/icons'
import Taro, { useRouter } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { listHistoryMessages, sendMessage, markMessageRead } from '@/api/chat/chatMessageController'
import { Skeleton } from '@taroify/core'

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

  // Mark messages as read
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
        // Silent fail for read receipt
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
        // Sort by time ascending for chat display [oldest ... newest]
        const sortedMsgs = [...(res.data || [])].sort((a, b) => 
          new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime()
        )
        setMessages(sortedMsgs)
        // Mark read after fetching
        markRead(sortedMsgs)
      }
    } catch (err) {
      console.error('Fetch messages failed:', err)
    } finally {
      setLoading(false)
    }
  }, [roomId, markRead])

  // Initial load and title setup
  useEffect(() => {
    if (roomName) {
      Taro.setNavigationBarTitle({ title: decodeURIComponent(roomName) })
    }
    fetchMessages()
    
    // Simple polling for real-time feel in MVP
    pollingTimer.current = setInterval(() => {
      fetchMessages(true)
    }, 5000)

    return () => {
      if (pollingTimer.current) clearInterval(pollingTimer.current)
    }
  }, [roomId, roomName, fetchMessages])

  // Scroll to bottom when messages change
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
        type: 1 // 1-Text
      })
      
      if (res.code === 0) {
        setInputValue('')
        // Refresh messages immediately
        await fetchMessages(true)
      }
    } catch (err) {
      console.error('Send message failed:', err)
      Taro.showToast({ title: '发送失败', icon: 'none' })
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return ''
    const date = new Date(timeStr.replace(/-/g, '/'))
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const hasText = inputValue.trim().length > 0

  return (
    <View className='mall-page chat-page'>
      <ScrollView
        scrollY
        enhanced
        scrollWithAnimation
        className='chat-page__scroll'
        showScrollbar={false}
        scrollIntoView={scrollIntoView}
      >
        <View className='chat-page__content'>
          {loading && messages.length === 0 ? (
            <View style={{ padding: '32rpx' }}>
              <Skeleton variant='rect' height='60rpx' width='60%' style={{ marginBottom: '32rpx', borderRadius: '12rpx' }} />
              <Skeleton variant='rect' height='60rpx' width='40%' style={{ alignSelf: 'flex-end', marginBottom: '32rpx', borderRadius: '12rpx' }} />
              <Skeleton variant='rect' height='80rpx' width='70%' style={{ marginBottom: '32rpx', borderRadius: '12rpx' }} />
            </View>
          ) : messages.length === 0 ? (
            <View className='chat-page__empty'>
              <Text className='chat-page__empty-text'>暂无消息，开始聊天吧</Text>
            </View>
          ) : (
            messages.map((msg) => {
              const isMe = msg.fromUserId === userInfo?.id
              return (
                <View
                  id={`msg-${msg.id}`}
                  key={msg.id}
                  className={`chat-message ${isMe ? 'chat-message--mine' : ''}`}
                >
                  <View className={`mall-avatar mall-avatar--circle mall-avatar--${isMe ? 'blue' : 'gray'} chat-message__avatar`}>
                    <Image 
                      src={msg.fromUserAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.fromUserId}`} 
                      className='chat-message__avatar-img' 
                    />
                  </View>

                  <View className='chat-message__body'>
                    {!isMe && <Text className='chat-message__sender-name'>{msg.fromUserName}</Text>}
                    <View className={`chat-bubble ${isMe ? 'chat-bubble--mine' : ''}`}>
                      <Text className='chat-bubble__text'>{msg.content}</Text>
                    </View>
                    <Text className='chat-message__time-inline'>{formatTime(msg.createTime)}</Text>
                  </View>
                </View>
              )
            })
          )}
          {/* Bottom spacer for scroll area */}
          <View style={{ height: '32rpx' }} />
        </View>
      </ScrollView>

      {/* Input Composer */}
      <View className='chat-page__composer'>
        <View className='chat-page__composer-inner'>
          <View className='chat-page__circle-btn' hoverClass='chat-page__circle-btn--pressed'>
            <Audio size='20px' style={{ color: '#8E8E93' }} />
          </View>

          <View className='chat-page__input-shell'>
            <Input
              className='chat-page__input-field'
              placeholder='输入消息...'
              placeholderStyle='color: #BCBCC4;'
              value={inputValue}
              onInput={e => setInputValue(e.detail.value)}
              onConfirm={handleSend}
              confirmType='send'
              adjustPosition
              cursorSpacing={20}
              disabled={sending}
            />
          </View>

          <View className='chat-page__action-icons'>
            <SmileOutlined size='22px' style={{ color: '#8E8E93' }} />
            <View
              className={`chat-page__plus-btn ${hasText ? 'is-send' : ''} ${sending ? 'is-loading' : ''}`}
              onClick={handleSend}
              hoverClass='chat-page__plus-btn--pressed'
            >
              {hasText ? (
                <Text className='chat-page__send-label'>{sending ? '...' : '发送'}</Text>
              ) : (
                <Plus size='18px' style={{ color: '#fff' }} />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
