import { useState } from 'react'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import { Audio, SmileOutlined, NotesOutlined } from '@taroify/icons'
import { useDidShow, useRouter, setNavigationBarTitle } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { MOCK_CHATS } from '@/services/mockData'
import { setActiveTab } from '@/store/slices/appSlice'

import './index.scss'

/**
 * 聊天详情页
 */
export default function ChatDetail() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id, name } = router.params

  const [messages, setMessages] = useState(() => MOCK_CHATS[id || '2'] || [])
  const [inputValue, setInputValue] = useState('')
  const [scrollIntoView, setScrollIntoView] = useState('')

  useDidShow(() => {
    dispatch(setActiveTab('chat'))
    setNavigationBarTitle({ title: name || '聊天' })
    if (messages.length > 0) {
      setTimeout(() => {
        setScrollIntoView(`msg-${messages[messages.length - 1].id}`)
      }, 300)
    }
  })

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMsg = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: '我',
      avatar: 'https://i.pravatar.cc/150?img=11',
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }

    setMessages([...messages, newMsg])
    setInputValue('')

    setTimeout(() => {
      setScrollIntoView(`msg-${newMsg.id}`)
    }, 100)
  }

  return (
    <View className='mall-page chat-page'>
      <ScrollView
        scrollY
        className='chat-page__scroll'
        enhanced
        showScrollbar={false}
        scrollIntoView={scrollIntoView}
      >
        <View className='chat-page__content'>
          <View className='chat-page__notice'>
            <Text className='chat-page__notice-text'>安全沟通中，仅当前会话可见</Text>
          </View>

          {messages.map((msg) => (
            <View
              id={`msg-${msg.id}`}
              key={msg.id}
              className={`chat-message ${msg.senderId === 'me' ? 'chat-message--mine' : ''}`}
            >
              <View className='chat-message__avatar'>
                <Image className='mall-avatar' mode='aspectFill' src={msg.avatar} />
              </View>

              <View className='chat-message__body'>
                <Text className='chat-message__time'>{msg.time}</Text>
                {msg.type === 'text' && (
                  <View className={`chat-message__bubble ${msg.senderId === 'me' ? 'chat-message__bubble--mine' : ''}`}>
                    <Text className={`chat-message__bubble-text ${msg.senderId === 'me' ? 'chat-message__bubble-text--mine' : ''}`}>
                      {msg.content}
                    </Text>
                  </View>
                )}

                {msg.type === 'file' && (
                  <View className='chat-message__file'>
                    <NotesOutlined size='54rpx' className='chat-message__file-icon' />
                    <View className='chat-message__file-main'>
                      <Text className='chat-message__file-name mall-text-ellipsis'>{msg.fileName}</Text>
                      <Text className='chat-message__file-size'>{msg.fileSize}</Text>
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
          <View className='chat-page__composer-icon'>
            <Audio size='42rpx' />
          </View>

          <View className='chat-page__input-wrap'>
            <Input
              placeholder='输入消息...'
              className='chat-page__input'
              value={inputValue}
              onInput={(e) => setInputValue(e.detail.value)}
              onConfirm={handleSend}
              confirmType='send'
              adjustPosition
            />
          </View>

          <View className='chat-page__composer-icon'>
            <SmileOutlined size='42rpx' />
          </View>

          <View className='chat-page__send' hoverClass='is-pressed' onClick={handleSend}>
            <Text className='chat-page__send-text'>发送</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
