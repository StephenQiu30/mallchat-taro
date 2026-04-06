import { View, Text, ScrollView } from '@tarojs/components'
import { Badge, Avatar } from '@taroify/core'
import { Search as SearchIcon } from '@taroify/icons'
import Taro, { useDidShow } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '../../store/slices/appSlice'

const MOCK_MESSAGES = [
  {
    id: 1,
    name: 'MallChat 助手',
    text: '欢迎来到 MallChat！这是一个基于 Taro 的跨端商城聊天系统。',
    time: '12:00',
    avatar: 'https://i.pravatar.cc/150?img=1',
    unread: 2
  },
  {
    id: 2,
    name: '阿亮',
    text: '最近那篇关于 React 性能优化的文章看了吗？',
    time: '昨天',
    avatar: 'https://i.pravatar.cc/150?img=2',
    unread: 0
  },
  {
    id: 3,
    name: '产品经理-老王',
    text: '下午 3 点有个需求评审会，记得参加。',
    time: '星期一',
    avatar: 'https://i.pravatar.cc/150?img=3',
    unread: 5
  },
  {
    id: 4,
    name: '设计妹子-小红',
    text: '新的 UI 稿已经上传到蓝湖了，帮我康康~',
    time: '2024-03-20',
    avatar: 'https://i.pravatar.cc/150?img=4',
    unread: 0
  }
]

export default function MessageIndex() {
  const dispatch = useDispatch()

  useDidShow(() => {
    dispatch(setActiveTab('message'))
  })

  return (
    <View className='flex-1 flex flex-col overflow-hidden'>
      {/* 1. 搜索框 Search Bar */}
      <View className='px-[32rpx] py-1'>
        <View className='relative glass-effect rounded-[32rpx] h-[88rpx] flex items-center px-[32rpx] border border-white shadow-sm'>
          <SearchIcon size='36rpx' className='text-slate-400' />
          <Text className='ml-3 text-[28rpx] text-slate-400 font-medium'>搜索聊天内容...</Text>
        </View>
      </View>

      {/* 2. 消息列表 Message List */}
      <ScrollView 
        scrollY 
        className='flex-1 mt-[16rpx]' 
        enhanced 
        showScrollbar={false}
        lowerThreshold={50}
      >
        <View className='px-[32rpx] space-y-[8rpx] pb-[160rpx]'>
          {MOCK_MESSAGES.map((msg) => (
            <View 
              key={msg.id} 
              className='flex items-center p-[32rpx] bg-white rounded-[40rpx] active:bg-slate-50 transition-colors shadow-sm mb-[20rpx] border border-slate-50'
              onClick={() => Taro.navigateTo({ url: '/pages/chat/index' })}
            >
              <View className='relative'>
                <Avatar src={msg.avatar} className='w-[104rpx] h-[104rpx] rounded-[32rpx] shadow-sm' />
                {msg.unread > 0 && (
                  <Badge 
                    content={msg.unread} 
                    className='absolute -top-[12rpx] -right-[12rpx] border-[4rpx] border-white' 
                  />
                )}
              </View>
              <View className='ml-[28rpx] flex-1 flex flex-col justify-between h-[88rpx] py-1'>
                <View className='flex justify-between items-center'>
                  <Text className='text-[32rpx] font-black text-slate-800 tracking-tight'>{msg.name}</Text>
                  <Text className='text-[22rpx] text-slate-400 font-medium tracking-tighter'>{msg.time}</Text>
                </View>
                <Text className='text-[26rpx] text-slate-500 truncate w-[420rpx] font-medium'>{msg.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
