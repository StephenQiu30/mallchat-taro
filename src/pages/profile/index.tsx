import { View, Text, ScrollView } from '@tarojs/components'
import { Avatar, Cell, Badge } from '@taroify/core'
import { ArrowRight, BalanceOutlined, StarOutlined, GemOutlined, LocationOutlined } from '@taroify/icons'
import Taro, { useDidShow } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '../../store/slices/appSlice'

export default function ProfileIndex() {
  const dispatch = useDispatch()
  const { statusBarHeight } = Taro.getSystemInfoSync()

  useDidShow(() => {
    dispatch(setActiveTab('profile'))
  })

  return (
    <View className='flex-1 flex flex-col overflow-hidden'>
      {/* 1. 顶部蓝色背景渐变 (Premium Mesh) */}
      <View 
        className='absolute top-[-160rpx] left-0 right-0 h-[440rpx] mesh-gradient rounded-b-[80rpx] z-0 shadow-lg'
        style={{ paddingTop: `${statusBarHeight}px` }}
      />

      {/* 2. 个人信息卡片 */}
      <View className='px-[32rpx] mt-[16rpx] z-10'>
        <View className='bg-white rounded-[48rpx] p-[48rpx] shadow-xl shadow-blue-500/10 border border-white flex flex-col'>
          <View className='flex items-center'>
            <View className='relative'>
              <Avatar src='https://i.pravatar.cc/150?img=11' className='w-[160rpx] h-[160rpx] border-[8rpx] border-white shadow-xl rounded-[40rpx]' />
              <View className='absolute bottom-[8rpx] right-[8rpx] w-[40rpx] h-[40rpx] bg-green-500 rounded-full border-[4rpx] border-white shadow-sm' />
            </View>
            <View className='ml-[40rpx] flex-1'>
               <Text className='text-[48rpx] font-black text-slate-900'>前端攻城狮</Text>
               <Text className='text-[28rpx] text-slate-400 mt-[8rpx] font-medium block'>账号 ID: 123456789</Text>
            </View>
            <ArrowRight className='text-slate-300' />
          </View>

          <View className='flex mt-[64rpx] pt-[48rpx] border-t border-slate-50'>
             {[
               { label: '空间访客', value: '128' },
               { label: '好友动态', value: '45' },
               { label: '我的收藏', value: '12' }
             ].map((item, i) => (
               <View key={i} className='flex-1 text-center active:scale-95 transition-transform py-[8rpx]'>
                 <Text className='text-[40rpx] font-black text-slate-900 block'>{item.value}</Text>
                 <Text className='text-[24rpx] text-slate-400 mt-[8rpx] font-bold'>{item.label}</Text>
               </View>
             ))}
          </View>
        </View>
      </View>

      {/* 3. 列表服务卡片 */}
      <ScrollView scrollY className='flex-1 mt-4 z-10' enhanced showScrollbar={false}>
        <View className='px-4 space-y-5 pb-32'>
           <View className='bg-white rounded-[48rpx] shadow-sm border border-slate-50 overflow-hidden'>
              <Cell title={<View className='text-[32rpx] font-bold'>我的钱包</View>} icon={<BalanceOutlined size='48rpx' className='text-blue-500' />} rightIcon={<Text className='text-[28rpx] text-slate-400 font-bold mr-[8rpx]'>¥ 88.00</Text>} />
              <Cell title={<View className='text-[32rpx] font-bold'>个性装扮</View>} icon={<StarOutlined size='48rpx' className='text-purple-500' />} />
              <Cell title={<View className='text-[32rpx] font-bold'>收藏夹</View>} icon={<StarOutlined size='48rpx' className='text-yellow-500' />} />
           </View>

           <View className='bg-white rounded-[48rpx] shadow-sm border border-slate-50 overflow-hidden'>
              <Cell title={<View className='text-[32rpx] font-bold'>游戏中心</View>} icon={<GemOutlined size='48rpx' className='text-green-500' />} rightIcon={<Badge content={''} className='mr-[8rpx]' />} />
              <Cell title={<View className='text-[32rpx] font-bold'>小程序</View>} icon={<LocationOutlined size='48rpx' className='text-orange-500' />} />
           </View>
        </View>
      </ScrollView>
    </View>
  )
}
