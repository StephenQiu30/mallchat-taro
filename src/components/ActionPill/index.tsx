import { ReactNode } from 'react'
import { View } from '@tarojs/components'

import './index.scss'

type ActionPillProps = {
  icon?: ReactNode
  text?: string
  variant?: 'primary' | 'subtle'
  className?: string
  onClick?: () => void
}

export default function ActionPill(props: ActionPillProps) {
  const { icon, text, variant = 'subtle', className = '', onClick } = props

  return (
    <View className={`mall-ios-pill mall-ios-pill--${variant} ${className}`.trim()} onClick={onClick}>
      {icon}
      {text ? <View>{text}</View> : null}
    </View>
  )
}
