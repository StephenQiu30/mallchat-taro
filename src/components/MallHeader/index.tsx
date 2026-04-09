import { ReactNode, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface MallHeaderProps {
  title?: string
  showAvatar?: boolean
  leftContent?: ReactNode
  rightContent?: ReactNode
  avatarSrc?: string
}

export default function MallHeader(props: MallHeaderProps) {
  const { title, showAvatar, leftContent, rightContent, avatarSrc } = props

  const systemInfo = useMemo(() => Taro.getSystemInfoSync(), [])
  const statusBarHeight = systemInfo.statusBarHeight || 0
  
  // Capsule position (WeChat specific)
  const menuButtonInfo = useMemo(() => {
    if (process.env.TARO_ENV === 'weapp') {
      return Taro.getMenuButtonBoundingClientRect()
    }
    return { top: 44, height: 32 }
  }, [])

  const headerHeight = useMemo(() => {
    if (process.env.TARO_ENV === 'weapp') {
      return (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height
    }
    return 44
  }, [menuButtonInfo, statusBarHeight])

  return (
    <View 
      className='mall-header-wrap'
      style={{ paddingTop: `${statusBarHeight}px` }}
    >
      <View 
        className='mall-header'
        style={{ height: `${headerHeight}px` }}
      >
        <View className='mall-header__left'>
          {leftContent}
          {showAvatar && (
            <View className='mall-header__avatar-box'>
              <Image 
                src={avatarSrc || 'https://i.pravatar.cc/150?img=11'} 
                className='mall-header__avatar'
              />
            </View>
          )}
          {title && <Text className='mall-header__title'>{title}</Text>}
        </View>

        <View className='mall-header__right'>
          {rightContent}
        </View>
      </View>
    </View>
  )
}
