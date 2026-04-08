import { PropsWithChildren } from 'react'
import { View } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { TabBar } from '@/layout/TabBar'

/**
 * 全局根布局
 * 移除了自定义 Navbar 逻辑，采用系统原生标题栏
 */
export function RootLayout({ children }: PropsWithChildren) {
  const activeTab = useSelector((state: RootState) => state.app.activeTab)
  const isTabbarPage = ['message', 'contact', 'profile'].includes(activeTab)

  return (
    <View className='h-full flex flex-col bg-gray-50 relative'>
      {/* 内容主容器 */}
      <View className='flex-1 relative flex flex-col overflow-y-auto'>
        {children}
      </View>

      {/* 底部导航栏 */}
      {isTabbarPage && <TabBar />}
    </View>
  )
}
