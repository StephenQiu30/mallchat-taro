import { useEffect, useState } from 'react'
import { Input, ScrollView, Text, View, Image } from '@tarojs/components'
import { Audio, NotesOutlined, Plus, SmileOutlined } from '@taroify/icons'
import { useRouter } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { MOCK_CHATS, type ChatMessage } from '@/services/mockData'
import { setActiveTab } from '@/store/slices/appSlice'

import './index.scss'

function formatClockTime() {
  const now = new Date()
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  return `${hour}:${minute}`
}

export default function ChatDetail() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.params
  
  // Use the name from params if possible, though we rely on native header for title
  const [messages, setMessages] = useState<ChatMessage[]>(() => MOCK_CHATS[id || '1'] || [])
  const [inputValue, setInputValue] = useState('')
  const [scrollIntoView, setScrollIntoView] = useState('')

  useEffect(() => {
    dispatch(setActiveTab('chat'))
  }, [dispatch])

  useEffect(() => {
    const chatMsg = MOCK_CHATS[id || '1'] || []
    setMessages(chatMsg)
  }, [id])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const lastId = messages[messages.length - 1].id
      // Delay slightly to ensure DOM is ready
      const timer = setTimeout(() => {
        setScrollIntoView(`msg-${lastId}`)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text) return

    const newMsg: ChatMessage = {
      id: `new-${Date.now()}`,
      senderId: 'me',
      senderName: '我',
      avatarLabel: '我',
      avatarTone: 'sky',
      content: text,
      time: formatClockTime(),
      type: 'text',
    }

    setMessages(prev => [...prev, newMsg])
    setInputValue('')
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
          <View className='chat-page__timestamp'>
            <Text className='chat-page__timestamp-text'>{messages[0]?.time || '刚刚'}</Text>
          </View>

          {messages.map((msg) => {
            const isMe = msg.senderId === 'me'
            return (
              <View
                id={`msg-${msg.id}`}
                key={msg.id}
                className={`chat-message ${isMe ? 'chat-message--mine' : ''}`}
              >
                <View className={`mall-avatar mall-avatar--circle mall-avatar--${isMe ? 'blue' : msg.avatarTone} chat-message__avatar`}>
                  {isMe ? (
                    <Image src='https://i.pravatar.cc/150?img=11' className='chat-message__avatar-img' />
                  ) : (
                    <Text className='chat-message__avatar-text'>{msg.avatarLabel}</Text>
                  )}
                </View>

                <View className='chat-message__body'>
                  {msg.type === 'text' && (
                    <View className={`chat-bubble ${isMe ? 'chat-bubble--mine' : ''}`}>
                      <Text className='chat-bubble__text'>{msg.content}</Text>
                    </View>
                  )}

                  {msg.type === 'file' && (
                    <View className='chat-file-card' hoverClass='chat-file-card--pressed'>
                      <View className='chat-file-card__icon'>
                        <NotesOutlined size='28px' style={{ color: '#f59e0b' }} />
                      </View>
                      <View className='chat-file-card__main'>
                        <Text className='chat-file-card__name mall-text-ellipsis'>{msg.fileName}</Text>
                        <Text className='chat-file-card__size'>{msg.fileSize}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )
          })}
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
            />
          </View>

          <View className='chat-page__action-icons'>
            <SmileOutlined size='22px' style={{ color: '#8E8E93' }} />
            <View
              className={`chat-page__plus-btn ${hasText ? 'is-send' : ''}`}
              onClick={handleSend}
              hoverClass='chat-page__plus-btn--pressed'
            >
              {hasText ? (
                <Text className='chat-page__send-label'>发送</Text>
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
