import { View, Text, ScrollView } from '@tarojs/components'
import { Avatar } from '@taroify/core'
import { ArrowRight, SettingOutlined, BalanceOutlined, StarOutlined, GemOutlined, ShoppingCartOutlined } from '@taroify/icons'
import { useDidShow, setNavigationBarTitle } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '../../store/slices/appSlice'

/**
 * 个人中心页 - 专业重构版
 * 基于 Taroify UI 实现
 */
export default function ProfileIndex() {
  const dispatch = useDispatch()

  useDidShow(() => {
    dispatch(setActiveTab('profile'))
    setNavigationBarTitle({ title: '空间' })
  })

  return (
    <View className='flex-1 flex flex-col bg-gray-50 h-full relative'>
      <ScrollView scrollY className='flex-1 relative z-10' enhanced showScrollbar={false}>
        <View className='pb-10'>
          
          {/* 用户基础信息卡片 */}
          <View className='p-4'>
            <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center mb-4'>
              <Avatar src='https://i.pravatar.cc/150?img=11' className='w-16 h-16 rounded-xl border-2 border-white shadow-sm' />
              <View className='ml-4 flex-1'>
                 <Text className='text-lg font-bold text-gray-900 block'>MallChat 用户</Text>
                 <Text className='text-xs text-gray-400 mt-1 block'>账号 ID: 888888</Text>
              </View>
              <ArrowRight className='text-gray-300' size='32rpx' />
            </View>

            {/* 个人数据统计 */}
            <View className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-around mb-4'>
                 {[
                   { label: '访客', value: '128' },
                   { label: '状态', value: '45' },
                   { label: '收藏', value: '12' }
                 ].map((item, i) => (
                   <View key={i} className='text-center flex-1'>
                     <Text className='text-base font-bold text-gray-900 block'>{item.value}</Text>
                     <Text className='text-[20rpx] text-gray-400 mt-0.5'>{item.label}</Text>
                   </View>
                 ))}
            </View>

            {/* 功能列表 */}
            <View className='space-y-4'>
              <View className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                 <View className='flex items-center p-4 border-b border-gray-50 active:bg-gray-50 transition-all'>
                    <BalanceOutlined size='40rpx' className='text-blue-500' />
                    <Text className='ml-3 font-semibold text-gray-800 flex-1 transition-all'>我的钱包</Text>
                    <ArrowRight className='text-gray-300' size='32rpx' />
                 </View>
                 <View className='flex items-center p-4 border-b border-gray-50 active:bg-gray-50 transition-all'>
                    <GemOutlined size='40rpx' className='text-purple-500' />
                    <Text className='ml-3 font-semibold text-gray-800 flex-1'>装扮商城</Text>
                    <ArrowRight className='text-gray-300' size='32rpx' />
                 </View>
                 <View className='flex items-center p-4 active:bg-gray-50 transition-all'>
                    <StarOutlined size='40rpx' className='text-yellow-500' />
                    <Text className='ml-3 font-semibold text-gray-800 flex-1'>收藏中心</Text>
                    <ArrowRight className='text-gray-300' size='32rpx' />
                 </View>
              </View>

              <View className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                 <View className='flex items-center p-4 border-b border-gray-50 active:bg-gray-50 transition-all'>
                    <ShoppingCartOutlined size='40rpx' className='text-orange-500' />
                    <Text className='ml-3 font-semibold text-gray-800 flex-1'>精选小程序</Text>
                    <ArrowRight className='text-gray-300' size='32rpx' />
                 </View>
                 <View className='flex items-center p-4 active:bg-gray-50 transition-all'>
                    <SettingOutlined size='40rpx' className='text-gray-500' />
                    <Text className='ml-3 font-semibold text-gray-800 flex-1'>系统设置</Text>
                    <ArrowRight className='text-gray-300' size='32rpx' />
                 </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
