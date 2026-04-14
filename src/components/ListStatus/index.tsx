import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button, Empty, Skeleton } from '@taroify/core'

type ListStatusProps = {
  kind: 'loading' | 'empty' | 'login'
  description: string
  skeletonRows?: number
  onLogin?: () => void
}

export default function ListStatus(props: ListStatusProps) {
  const { kind, description, skeletonRows = 4, onLogin } = props

  if (kind === 'loading') {
    return (
      <View className='mall-status-shell'>
        {Array.from({ length: skeletonRows }).map((_, index) => (
          <View key={index} style={{ marginBottom: '24rpx' }}>
            <Skeleton avatar title row={2} loading />
          </View>
        ))}
      </View>
    )
  }

  if (kind === 'login') {
    return (
      <Empty className='mall-status-shell'>
        <Empty.Description>{description}</Empty.Description>
        <Button
          color='primary'
          shape='round'
          size='small'
          style={{ marginTop: '24rpx' }}
          onClick={onLogin || (() => Taro.switchTab({ url: '/pages/profile/index' }))}
        >
          去登录
        </Button>
      </Empty>
    )
  }

  return (
    <Empty className='mall-status-shell'>
      <Empty.Description>{description}</Empty.Description>
    </Empty>
  )
}
