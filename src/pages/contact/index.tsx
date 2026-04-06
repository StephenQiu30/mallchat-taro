import { View, Text, ScrollView } from '@tarojs/components'
import { Avatar, Cell } from '@taroify/core'
import { ArrowRight, Search as SearchIcon } from '@taroify/icons'
import { useDidShow } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '../../store/slices/appSlice'

export default function ContactIndex() {
  const dispatch = useDispatch()

  useDidShow(() => {
    dispatch(setActiveTab('contact'))
  })

  return (
    <View className='flex-1 flex flex-col overflow-hidden'>
      {/* 1. 搜索框 */}
      <View className='px-[40rpx] py-1'>
        <View className='relative glass-effect rounded-[32rpx] h-[88rpx] flex items-center px-[32rpx] border border-white shadow-sm'>
          <SearchIcon size='36rpx' className='text-slate-400' />
          <Text className='ml-3 text-[28rpx] text-slate-400 font-medium'>搜索好友或群组...</Text>
        </View>
      </View>

      {/* 2. 好友列表 */}
      <ScrollView scrollY className='flex-1 mt-4' enhanced showScrollbar={false}>
        <View className='px-4 space-y-4 pb-32'>
          <View className='bg-white rounded-[48rpx] shadow-sm border border-slate-50 overflow-hidden'>
              <Cell title={<View className='text-[32rpx] font-bold'>新的朋友</View>} icon={<Avatar className='bg-orange-500 text-white w-8 h-8 rounded-xl'>N</Avatar>} rightIcon={<ArrowRight />} />
              <Cell title={<View className='text-[32rpx] font-bold'>群聊</View>} icon={<Avatar className='bg-blue-500 text-white w-8 h-8 rounded-xl'>G</Avatar>} rightIcon={<ArrowRight />} />
          </View>

          <Text className='text-[24rpx] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block'>A - Z</Text>
          <View className='bg-white rounded-[48rpx] shadow-sm border border-slate-50 overflow-hidden'>
              {[
                { name: '阿亮', desc: '[在线] 正在敲代码...' },
                { name: '安吉拉', desc: '[离线] 休息中' },
                { name: '阿强', desc: '[在线] 这个需求我做不了' }
              ].map((item, i) => (
                <Cell 
                  key={i}
                  title={<View className='text-[32rpx] font-bold'>{item.name}</View>}
                  brief={<Text className='text-[24rpx] text-slate-400'>{item.desc}</Text>}
                  icon={<Avatar src={`https://i.pravatar.cc/150?img=${i+10}`} className='w-10 h-10 rounded-2xl shadow-sm' />}
                />
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
