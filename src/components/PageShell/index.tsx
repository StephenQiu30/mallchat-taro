import { PropsWithChildren, ReactNode } from 'react'
import { ScrollView, View } from '@tarojs/components'

import './index.scss'

type PageShellProps = PropsWithChildren<{
  header?: ReactNode
  scroll?: boolean
  bodyClassName?: string
  contentClassName?: string
}>

export default function PageShell(props: PageShellProps) {
  const {
    header,
    children,
    scroll = false,
    bodyClassName = '',
    contentClassName = '',
  } = props

  return (
    <View className='mall-page mall-page-shell'>
      {header ? <View className='mall-page-shell__header'>{header}</View> : null}

      {scroll ? (
        <ScrollView scrollY className={`mall-page__body mall-page__body--scroll ${bodyClassName}`.trim()}>
          <View className={`mall-page__content ${contentClassName}`.trim()}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <View className={`mall-page__body ${bodyClassName}`.trim()}>
          <View className={`mall-page__content ${contentClassName}`.trim()}>
            {children}
          </View>
        </View>
      )}
    </View>
  )
}
