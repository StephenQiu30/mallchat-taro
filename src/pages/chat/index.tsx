import { useState, useMemo } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { Audio, SmileOutlined, Plus, Description } from '@taroify/icons'
import { Avatar } from '@taroify/core'
import { useDidShow, useRouter, setNavigationBarTitle } from '@tarojs/taro'
import { MOCK_CHATS } from '../../services/mockData'

/**
 * 聊天详情页 - 专业重构版
 * 采用原生导航栏标题
 */
export default function ChatDetail() {
  const router = useRouter()
  const { id, name } = router.params
  
  const initialMessages = useMemo(() => {
    return MOCK_CHATS[id || '2'] || []
  }, [id])

  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [scrollIntoView, setScrollIntoView] = useState('')

  useDidShow(() => {
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
    <View className='flex-1 flex flex-col bg-gray-50 h-full'>
      {/* 消息区域 */}
      <ScrollView 
        scrollY 
        className='flex-1 bg-[#F2F3F5]'
        enhanced
        showScrollbar={false}
        scrollIntoView={scrollIntoView}
      >
        <View className='p-4 space-y-6 pb-[240rpx]'>
          {messages.map((msg) => (
            <View 
              id={`msg-${msg.id}`}
              key={msg.id} 
              className={`flex ${msg.senderId === 'me' ? 'flex-row-reverse' : 'flex-row'} items-start`}
            >
              <Avatar src={msg.avatar} className={`w-10 h-10 shadow-sm mt-1 ${msg.senderId === 'me' ? 'ml-3' : 'mr-3'}`} />
              
              <div className={`max-w-[70%] flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}>
                {msg.type === 'text' && (
                  <View className={`p-3 text-[30rpx] leading-relaxed shadow-sm border border-transparent ${
                    msg.senderId === 'me' 
                    ? 'bg-blue-600 text-white rounded-2xl' 
                    : 'bg-white text-gray-800 border-gray-100 rounded-2xl'
                  }`}>
                    {msg.content}
                  </View>
                )}

                {msg.type === 'file' && (
                  <View className='bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center active:bg-gray-50 transition-all w-full'>
                    <Description size='56rpx' className='text-yellow-500 mr-3 shrink-0' />
                    <View className='flex-1 min-w-0'>
                      <Text className='text-sm font-semibold text-gray-900 truncate block'>{msg.fileName}</Text>
                      <Text className='text-[22rpx] text-gray-400 font-medium'>{msg.fileSize}</Text>
                    </View>
                  </View>
                )}
              </div>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 底部输入框区域 */}
      <View className='bg-white border-t border-gray-100 px-4 py-3 pb-[safe-area-inset-bottom]'>
         <View className='flex items-center space-x-3'>
            <Audio size='44rpx' className='text-gray-500 active:text-blue-500 transition-colors' />
            
            <View className='flex-1 h-11 bg-gray-50 rounded-xl px-4 flex items-center border border-gray-100'>
              <Input 
                placeholder='输入消息...' 
                className='w-full h-full text-[28rpx] text-gray-800'
                value={inputValue}
                onInput={(e) => setInputValue(e.detail.value)}
                onConfirm={handleSend}
                confirmType='send'
                adjustPosition
              />
            </View>

            <SmileOutlined size='44rpx' className='text-gray-500 active:text-blue-500 transition-colors' />
            <Plus size='44rpx' className='text-gray-500 active:text-blue-500 transition-colors' onClick={handleSend} />
         </View>
      </View>
    </View>
  )
}
