import React from 'react'
import { View, Text } from '@tarojs/components'
import { Plus, Search as SearchIcon, AddOutlined, SettingOutlined, ArrowLeft, Bars } from '@taroify/icons'
import Taro from '@tarojs/taro'

export function SiteHeader() {
  const router = Taro.getCurrentInstance().router
  const path = router?.path || ''
  const params = router?.params || {}

  // 1. Index Header
  if (path.includes('pages/index/index')) {
    return (
      <View className='px-[32rpx] pt-[40rpx] pb-[24rpx] flex justify-between items-center bg-[#F8FAFC]/95 backdrop-blur-md'>
        <View className='flex flex-col'>
          <Text className='text-[44rpx] font-black text-slate-900 tracking-tight'>消息</Text>
          <View className='flex items-center mt-1'>
            <View className='w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8rpx_rgba(34,197,94,0.6)]' />
            <Text className='text-[22rpx] text-slate-400 font-bold uppercase tracking-wider'>Online Now</Text>
          </View>
        </View>
        <View className='flex items-center space-x-[24rpx]'>
          <View className='w-[80rpx] h-[80rpx] rounded-[24rpx] glass-effect flex items-center justify-center text-slate-600 active:scale-95 transition-all shadow-sm border border-white'>
            <SearchIcon size='40rpx' />
          </View>
          <View className='w-[80rpx] h-[80rpx] rounded-[24rpx] bg-blue-600 flex items-center justify-center text-white active:scale-95 transition-all shadow-lg shadow-blue-500/25'>
            <Plus size='40rpx' />
          </View>
        </View>
      </View>
    )
  }

  // 2. Contact Header
  if (path.includes('pages/contact/index')) {
    return (
      <View className='px-[40rpx] pt-[40rpx] pb-[24rpx] flex justify-between items-center bg-[#F8FAFC]/95 backdrop-blur-md'>
        <View className='flex flex-col'>
          <Text className='text-[44rpx] font-black text-slate-900 tracking-tight'>联系人</Text>
          <View className='flex items-center mt-1'>
            <Text className='text-[22rpx] text-slate-400 font-bold uppercase tracking-wider'>Your Network</Text>
          </View>
        </View>
        <View className='w-[80rpx] h-[80rpx] rounded-[24rpx] bg-blue-600 flex items-center justify-center text-white active:scale-95 transition-all shadow-lg shadow-blue-500/25'>
          <AddOutlined size='44rpx' />
        </View>
      </View>
    )
  }

  // 3. Profile Header
  if (path.includes('pages/profile/index')) {
    return (
      <View className='px-4 pt-4 pb-2 flex justify-end items-center'>
        <View className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:bg-white/30'>
          <SettingOutlined size='20' />
        </View>
      </View>
    )
  }

  // 4. Chat Detail Header
  if (path.includes('pages/chat/index')) {
    const chatTitle = params.title || '聊天'
    return (
      <View className='bg-white/95 backdrop-blur-md border-b border-slate-100'>
        <View className='h-[100rpx] px-[32rpx] flex justify-between items-center'>
          <View className='flex items-center active:bg-slate-100 px-[16rpx] py-[8rpx] -ml-[16rpx] rounded-[16rpx]' onClick={() => Taro.navigateBack()}>
            <ArrowLeft size='40rpx' className='text-slate-800' />
            <Text className='ml-[8rpx] text-[28rpx] font-medium text-slate-800'>返回</Text>
          </View>
          <Text className='text-[34rpx] font-bold text-slate-900 truncate max-w-[400rpx]'>{chatTitle}</Text>
          <View className='p-[16rpx] -mr-[16rpx] active:bg-slate-100 rounded-[16rpx]'>
            <Bars size='40rpx' className='text-slate-800' />
          </View>
        </View>
      </View>
    )
  }

  return null
}
