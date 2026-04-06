import { View, Text } from '@tarojs/components'
import { ChatOutlined, FriendsOutlined, LocationOutlined } from '@taroify/icons'
import Taro from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setActiveTab, TabType } from '../store/slices/appSlice'

export function AppFooter() {
  const dispatch = useDispatch()
  const activeTab = useSelector((state: RootState) => state.app.activeTab)

  const tabs: { key: TabType; title: string; icon: any; url: string }[] = [
    { key: 'message', title: '消息', icon: ChatOutlined, url: '/pages/index/index' },
    { key: 'contact', title: '联系人', icon: FriendsOutlined, url: '/pages/contact/index' },
    { key: 'profile', title: '空间', icon: LocationOutlined, url: '/pages/profile/index' }
  ]

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (activeTab === tab.key) return
    
    dispatch(setActiveTab(tab.key))
    Taro.reLaunch({ url: tab.url })
  }

  return (
    <View className='fixed bottom-[40rpx] left-[40rpx] right-[40rpx] glass-effect h-[120rpx] rounded-[60rpx] flex items-center px-[16rpx] z-50 shadow-[0_12rpx_48rpx_rgba(0,0,0,0.12)] bg-white'>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.key
        
        return (
          <View 
            key={tab.key}
            className={`flex-1 flex flex-col items-center justify-center space-y-[4rpx] transition-all transform active:scale-95 ${
              isActive 
                ? 'text-blue-600 bg-blue-50/50 rounded-[48rpx] h-[88rpx]' 
                : 'text-slate-400'
            }`}
            onClick={() => handleTabClick(tab)}
          >
            <Icon size='56rpx' />
            <Text className='text-[22rpx] font-bold'>{tab.title}</Text>
          </View>
        )
      })}
    </View>
  )
}
