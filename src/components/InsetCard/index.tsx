import { PropsWithChildren } from 'react'
import { View } from '@tarojs/components'

import './index.scss'

type InsetCardProps = PropsWithChildren<{
  className?: string
}>

export default function InsetCard({ className = '', children }: InsetCardProps) {
  return <View className={`mall-inset-card ${className}`.trim()}>{children}</View>
}
