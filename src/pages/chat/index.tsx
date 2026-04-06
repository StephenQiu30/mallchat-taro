import { useState } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { Audio, SmileOutlined, Plus, FriendsOutlined } from '@taroify/icons'
import { Avatar } from '@taroify/core'

/**
 * 模拟对话数据
 */
const MOCK_MESSAGES = [
  {
    id: '1',
    senderId: 'other',
    senderName: 'UI设计师 - 小李',
    avatar: 'https://i.pravatar.cc/150?img=32',
    content: '切图文件我已经发到群里了，你看一下尺寸对不对。还有图标需要换成 SVG 格式的吗？',
    time: '14:20',
    type: 'text'
  },
  {
    id: '2',
    senderId: 'me',
    senderName: '我',
    avatar: 'https://i.pravatar.cc/150?img=11',
    content: '收到了，尺寸没问题。图标最好是SVG的，这样在高清屏上不会模糊。',
    time: '14:25',
    type: 'text'
  },
  {
    id: '3',
    senderId: 'other',
    senderName: 'UI设计师 - 小李',
    avatar: 'https://i.pravatar.cc/150?img=32',
    content: 'icons_v2.zip (1.2 MB)',
    time: '14:30',
    type: 'file',
    fileName: 'icons_v2.zip',
    fileSize: '1.2 MB'
  }
]

export default function ChatDetail() {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [scrollIntoView, setScrollIntoView] = useState('')

  // 模拟发送消息
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

    // 滚动到底部
    setTimeout(() => {
      setScrollIntoView(`msg-${newMsg.id}`)
    }, 100)
  }

  return (
    <View className='chat-page flex-1 bg-[#F3F4F6] flex flex-col overflow-hidden'>
      {/* 1. 聊天内容区域 */}
      <ScrollView 
        scrollY 
        className='flex-1'
        enhanced
        showScrollbar={false}
        scrollIntoView={scrollIntoView}
      >
        <View className='px-[32rpx] py-[40rpx] space-y-[48rpx]'>
          {messages.map((msg) => (
            <View 
              id={`msg-${msg.id}`}
              key={msg.id} 
              className={`flex ${msg.senderId === 'me' ? 'flex-row-reverse' : 'flex-row'} items-start`}
            >
              <Avatar src={msg.avatar} className='w-[80rpx] h-[80rpx] rounded-[16rpx] shadow-sm' />
              
              <View className={`max-w-[70%] flex flex-col ${msg.senderId === 'me' ? 'mr-[24rpx] items-end' : 'ml-[24rpx] items-start'}`}>
                {/* 消息元信息 */}
                <View className='flex items-center space-x-[8rpx] mb-[8rpx]'>
                   <Text className='text-[22rpx] text-slate-400 font-medium'>{msg.senderName}</Text>
                   <Text className='text-[20rpx] text-slate-300'>{msg.time}</Text>
                </View>

                {/* 文本气泡 */}
                {msg.type === 'text' && (
                  <View className={`p-[24rpx] rounded-[32rpx] text-[32rpx] leading-relaxed shadow-sm ${
                    msg.senderId === 'me' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </View>
                )}

                {/* 文件消息 */}
                {msg.type === 'file' && (
                  <View className='bg-white p-[24rpx] rounded-[24rpx] shadow-sm border border-slate-100 flex items-center space-x-[24rpx] active:bg-slate-50 transition-colors'>
                    <View className='bg-blue-50 p-[16rpx] rounded-[12rpx]'>
                       <FriendsOutlined size='40rpx' className='text-blue-500' />
                    </View>
                    <View className='flex-1 min-w-0 pr-[24rpx]'>
                      <Text className='text-[28rpx] font-bold text-slate-800 truncate block'>{msg.fileName}</Text>
                      <Text className='text-[22rpx] text-slate-400 mt-[4rpx]'>{msg.fileSize}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 2. 底部输入框 */}
      <View className='bg-white border-t border-slate-100 px-[32rpx] pt-[24rpx] pb-[64rpx] safe-area-bottom'>
        <View className='flex items-center space-x-[32rpx]'>
          <Audio size='56rpx' className='text-slate-500' />
          
          <View className='flex-1 bg-slate-50 rounded-full h-[88rpx] px-[32rpx] flex items-center border border-slate-200 shadow-inner'>
            <Input 
              placeholder='输入消息...' 
              className='w-full text-[32rpx]'
              value={inputValue}
              onInput={(e) => setInputValue(e.detail.value)}
              onConfirm={handleSend}
              confirmType='send'
            />
          </View>

          <SmileOutlined size='56rpx' className='text-slate-500' />
          
          <View className='w-[80rpx] h-[80rpx] rounded-full bg-blue-600 flex items-center justify-center text-white active:bg-blue-700 shadow-lg' onClick={handleSend}>
             <Plus size='48rpx' />
          </View>
        </View>
      </View>
    </View>
  )
}
