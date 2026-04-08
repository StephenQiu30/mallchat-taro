import { Tabbar, Badge } from '@taroify/core'
import { ChatOutlined, FriendsOutlined, UserOutlined } from '@taroify/icons'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setActiveTab, TabType } from '../store/slices/appSlice'

/**
 * 全局导航栏 TabBar
 * 基于 Taroify UI 实现，符合微信原生设计规范
 */
export function TabBar() {
  const dispatch = useDispatch()
  const activeTab = useSelector((state: RootState) => state.app.activeTab)

  const handleSwitch = (value: TabType, url: string) => {
    if (activeTab === value) return
    dispatch(setActiveTab(value))
    Taro.reLaunch({ url })
  }

  return (
    <Tabbar 
      value={activeTab} 
      className='bg-white border-t border-gray-100 z-[1000] h-[100rpx] fixed bottom-0 left-0 right-0'
      safeArea="bottom"
      placeholder
    >
      <Tabbar.TabItem 
        value='message' 
        icon={
          <View className='relative'>
            <ChatOutlined size='44rpx' />
            <Badge content='4' className='absolute -top-[8rpx] -right-[12rpx] border-2 border-white' />
          </View>
        }
        className={`text-[20rpx] font-medium transition-all ${activeTab === 'message' ? 'text-blue-600' : 'text-gray-400'}`}
        onClick={() => handleSwitch('message', '/pages/index/index')}
      >
        消息
      </Tabbar.TabItem>

      <Tabbar.TabItem 
        value='contact' 
        icon={<FriendsOutlined size='44rpx' />}
        className={`text-[20rpx] font-medium transition-all ${activeTab === 'contact' ? 'text-blue-600' : 'text-gray-400'}`}
        onClick={() => handleSwitch('contact', '/pages/contact/index')}
      >
        联系人
      </Tabbar.TabItem>

      <Tabbar.TabItem 
        value='profile' 
        icon={<UserOutlined size='44rpx' />}
        className={`text-[20rpx] font-medium transition-all ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
        onClick={() => handleSwitch('profile', '/pages/profile/index')}
      >
        空间
      </Tabbar.TabItem>
    </Tabbar>
  )
}
