import React, { PropsWithChildren } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { RootProviders } from './Providers'
import { SiteHeader } from './Header'
import { AppFooter } from './Footer'

export function RootLayout({ children }: PropsWithChildren) {
  const router = Taro.getCurrentInstance().router
  const path = router?.path || ''
  const { statusBarHeight } = Taro.getSystemInfoSync()
  
  // 1. Determine current view type
  const isMessagePage = path.includes('pages/index/index')
  const isContactPage = path.includes('pages/contact/index')
  const isProfilePage = path.includes('pages/profile/index')
  const isTabbarPage = isMessagePage || isContactPage || isProfilePage

  // 2. Adjust transparent status bar (Profile only)
  const transparentStatusBar = isProfilePage

  return (
    <RootProviders>
      <View className='base-layout h-screen flex flex-col overflow-hidden bg-[#F8FAFC] font-sans'>
        {/* A. Status Bar Spacer (Dynamic Visibility) */}
        {!transparentStatusBar && (
          <View style={{ height: `${statusBarHeight}px` }} className='shrink-0 h-0 z-0 bg-inherit' />
        )}

        {/* B. Site Header */}
        <SiteHeader />

        {/* C. Page Content (Flex-1) */}
        <View className='flex-1 relative overflow-hidden flex flex-col'>
          {children}
        </View>

        {/* D. Global Footer (Tabbar) */}
        {isTabbarPage && <AppFooter />}
      </View>
    </RootProviders>
  )
}
