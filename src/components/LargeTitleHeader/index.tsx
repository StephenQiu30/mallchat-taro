import { PropsWithChildren, ReactNode } from 'react'
import { View } from '@tarojs/components'

import './index.scss'

type LargeTitleHeaderProps = PropsWithChildren<{
  title: string
  description?: string
  actions?: ReactNode
}>

export default function LargeTitleHeader(props: LargeTitleHeaderProps) {
  const { title, description, actions, children } = props

  return (
    <View className='mall-large-header'>
      <View className='mall-large-header__row'>
        <View className='mall-large-header__text'>
          <View className='mall-large-header__title'>{title}</View>
          {description ? <View className='mall-large-header__description'>{description}</View> : null}
        </View>
        {actions ? <View className='mall-large-header__actions'>{actions}</View> : null}
      </View>
      {children ? <View className='mall-large-header__extra'>{children}</View> : null}
    </View>
  )
}
