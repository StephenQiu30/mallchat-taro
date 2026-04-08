import { useEffect, useState } from 'react'
import { Input, ScrollView, Text, View } from '@tarojs/components'
import { ArrowLeft, Audio, Bars, NotesOutlined, Plus, SmileOutlined } from '@taroify/icons'
import { navigateBack, useDidShow, useRouter } from '@tarojs/taro'
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
  const { id, name } = router.params
  const currentName = name || '聊天'

  const [messages, setMessages] = useState<ChatMessage[]>(() => MOCK_CHATS[id || '2'] || [])
  const [inputValue, setInputValue] = useState('')
  const [scrollIntoView, setScrollIntoView] = useState('')

  useDidShow(() => {
    dispatch(setActiveTab('chat'))
  })

  useEffect(() => {
    setMessages(MOCK_CHATS[id || '2'] || [])
  }, [id])

  useEffect(() => {
    if (!messages.length) {
      return
    }

    const timer = setTimeout(() => {
      setScrollIntoView(`msg-${messages[messages.length - 1].id}`)
    }, 80)

    return () => clearTimeout(timer)
  }, [messages])

  const handleSend = () => {
    const nextValue = inputValue.trim()

    if (!nextValue) {
      return
    }

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: '我',
      avatarLabel: '我',
      avatarTone: 'sky',
      content: nextValue,
      time: formatClockTime(),
      type: 'text',
    }

    setMessages((prev) => [...prev, newMsg])
    setInputValue('')
  }

  const hasText = inputValue.trim().length > 0

  return (
    <View className='mall-page chat-page'>
      <View className='mall-floating-orb chat-page__orb chat-page__orb--top' />
      <View className='mall-floating-orb chat-page__orb chat-page__orb--bottom' />

      <View className='chat-page__header'>
        <View className='chat-page__header-left' onClick={() => navigateBack()}>
          <ArrowLeft size='20px' />
          <Text className='chat-page__back-text'>返回</Text>
        </View>
        <Text className='chat-page__title mall-text-ellipsis'>{currentName}</Text>
        <View className='chat-page__header-right'>
          <Bars size='20px' />
        </View>
      </View>

      <ScrollView
        scrollY
        enhanced
        scrollWithAnimation
        className='chat-page__scroll'
        showScrollbar={false}
        scrollIntoView={scrollIntoView}
      >
        <View className='mall-page__content mall-page__content--chat chat-page__content'>
          <View className='chat-page__timestamp'>
            <Text className='chat-page__timestamp-text'>{messages[0]?.time || '刚刚'}</Text>
          </View>

          {messages.map((msg) => (
            <View
              id={`msg-${msg.id}`}
              key={msg.id}
              className={`chat-message ${msg.senderId === 'me' ? 'chat-message--mine' : ''}`}
            >
              <View className={`mall-avatar mall-avatar--circle mall-avatar--${msg.avatarTone} chat-message__avatar`}>
                <Text className='chat-message__avatar-text'>{msg.avatarLabel}</Text>
              </View>

              <View className='chat-message__body'>
                {msg.type === 'text' && (
                  <View className={`chat-bubble ${msg.senderId === 'me' ? 'chat-bubble--mine' : ''}`}>
                    <Text className='chat-bubble__text'>{msg.content}</Text>
                  </View>
                )}

                {msg.type === 'file' && (
                  <View className='chat-file-card'>
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
          ))}
        </View>
      </ScrollView>

      <View className='chat-page__composer'>
        <View className='chat-page__composer-inner'>
          <View className='chat-page__circle-btn'>
            <Audio size='18px' />
          </View>

          <View className='chat-page__input-shell'>
            <Input
              className='chat-page__input-field'
              placeholder='输入消息...'
              placeholderStyle='color: #8fa0b7;'
              value={inputValue}
              onInput={(e) => setInputValue(e.detail.value)}
              onConfirm={handleSend}
              confirmType='send'
              adjustPosition
            />
          </View>

          <View className='chat-page__action-icons'>
            <SmileOutlined size='22px' style={{ color: '#6d7a92' }} />
            <View
              className={`chat-page__plus-btn ${hasText ? 'is-send' : ''}`}
              onClick={handleSend}
            >
              {hasText ? (
                <Text className='chat-page__send-label'>发送</Text>
              ) : (
                <Plus size='16px' style={{ color: '#fff' }} />
              )}
            </View>
          </View>
        </View>
        <View className='mall-ios-indicator' />
      </View>
    </View>
  )
}
