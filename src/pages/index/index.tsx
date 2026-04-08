import { View, Text, ScrollView } from '@tarojs/components'
import { Badge, Avatar } from '@taroify/core'
import { Search as SearchIcon } from '@taroify/icons'
import Taro, { useDidShow, setNavigationBarTitle } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '../../store/slices/appSlice'
import { MOCK_CONVERSATIONS } from '../../services/mockData'

/**
 * 消息列表页 - 专业重构版
 * 1. 采用系统原生标题栏，移除自定义 Navbar
 * 2. 采用 TDesign 风格的卡片式布局
 */
export default function MessageIndex() {
  const dispatch = useDispatch()

  useDidShow(() => {
    dispatch(setActiveTab('message'))
    setNavigationBarTitle({ title: '消息' })
  })

  return (
    <View className='flex-1 flex flex-col bg-gray-50'>
      <ScrollView 
        scrollY 
        className='flex-1' 
        enhanced 
        showScrollbar={false}
      >
        <View className='px-4 pb-6 pt-4'>
          {/* 搜索框 - 扁平化平衡风格 */}
          <View className='mb-4'>
            <View className='bg-white h-10 rounded-xl flex items-center px-4 border border-gray-100 shadow-sm'>
              <SearchIcon size='32rpx' className='text-gray-400 mr-2' />
              <Text className='text-sm text-gray-400'>搜索常用联系人</Text>
            </View>
          </View>

          {/* 消息卡片列表 */}
          <View className='space-y-2'>
            {MOCK_CONVERSATIONS.map((msg) => (
              <View 
                key={msg.id} 
                className='bg-white p-4 rounded-xl flex items-center active:bg-gray-100 transition-all border border-gray-50'
                onClick={() => Taro.navigateTo({ url: `/pages/chat/index?id=${msg.id}&name=${msg.name}` })}
              >
                <View className='relative shrink-0'>
                  <Avatar 
                    src={msg.avatar} 
                    className='w-12 h-12 rounded-lg' 
                  />
                  {msg.unread > 0 && (
                    <Badge 
                      content={msg.unread} 
                      className='absolute -top-1 -right-1 border-2 border-white' 
                    />
                  )}
                </View>

                <View className='ml-4 flex-1 min-w-0'>
                  <View className='flex justify-between items-center mb-1'>
                    <Text className='text-base font-semibold text-gray-900 truncate'>{msg.name}</Text>
                    <Text className='text-[20rpx] text-gray-400 font-medium'>{msg.time}</Text>
                  </View>
                  <Text className='text-sm text-gray-500 truncate block'>{msg.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
