import { View, Text, ScrollView } from '@tarojs/components'
import { Avatar, Badge } from '@taroify/core'
import { ArrowRight, Search as SearchIcon, FriendsOutlined, ChatOutlined, ArrowDown } from '@taroify/icons'
import { useDidShow, setNavigationBarTitle } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '../../store/slices/appSlice'

/**
 * 联系人列表页 - 专业重构版
 * 基于 Taroify UI 实现
 */
export default function ContactIndex() {
  const dispatch = useDispatch()

  useDidShow(() => {
    dispatch(setActiveTab('contact'))
    setNavigationBarTitle({ title: '联系人' })
  })

  return (
    <View className='flex-1 flex flex-col bg-gray-50'>
      <ScrollView scrollY className='flex-1' enhanced showScrollbar={false}>
        <View className='px-4 pb-6 pt-4'>
          {/* 搜索框 */}
          <View className='mb-4'>
            <View className='bg-white h-10 rounded-xl flex items-center px-4 border border-gray-100 shadow-sm'>
              <SearchIcon size='32rpx' className='text-gray-400 mr-2' />
              <Text className='text-sm text-gray-400'>搜索联系人</Text>
            </View>
          </View>

          {/* 功能入口卡片 */}
          <View className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4'>
            <View className='flex items-center p-4 border-b border-gray-50 active:bg-gray-50 transition-all'>
              <View className='w-10 h-10 rounded-lg bg-orange-100 flex justify-center items-center text-orange-500'>
                 <FriendsOutlined size='40rpx' />
              </View>
              <Text className='ml-3 font-semibold text-gray-800 flex-1'>新朋友</Text>
              <ArrowRight className='text-gray-300' size='32rpx' />
            </View>
            <View className='flex items-center p-4 active:bg-gray-50 transition-all'>
              <View className='w-10 h-10 rounded-lg bg-blue-100 flex justify-center items-center text-blue-500'>
                 <ChatOutlined size='40rpx' />
              </View>
              <Text className='ml-3 font-semibold text-gray-800 flex-1'>群通知</Text>
              <Badge content='1' className='mr-2' />
              <ArrowRight className='text-gray-300' size='32rpx' />
            </View>
          </View>

          {/* 联系人分组 */}
          <View className='space-y-2'>
            <Text className='text-[22rpx] font-bold text-gray-400 ml-1 uppercase tracking-wider mb-1 block'>我的好友</Text>
            
            <View className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
              <View className='flex items-center p-4 border-b border-gray-50 active:bg-gray-50 transition-all'>
                <ArrowDown className='text-gray-400 w-4' size='32rpx' />
                <Text className='ml-2 font-semibold text-gray-800 flex-1'>特别关心</Text>
                <Text className='text-xs text-gray-400 font-medium'>1/1</Text>
              </View>
              
              <View className='bg-gray-50/30 pl-10 pr-4 py-3 flex items-center border-b border-gray-50 active:bg-gray-100'>
                <Avatar src='https://i.pravatar.cc/150?img=5' className='w-9 h-9 rounded-lg shadow-sm' />
                <View className='ml-3 flex-1 min-w-0'>
                  <Text className='text-sm font-semibold text-gray-800 block'>老妈</Text>
                  <Text className='text-[20rpx] text-gray-400 font-medium'>[4G] 刚才在线</Text>
                </View>
              </View>

              <View className='flex items-center p-4 border-b border-gray-50 active:bg-gray-50 transition-all'>
                <ArrowRight className='text-gray-400 w-4' size='32rpx' />
                <Text className='ml-2 font-semibold text-gray-800 flex-1'>主要联系人</Text>
                <Text className='text-xs text-gray-400 font-medium'>12/45</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
