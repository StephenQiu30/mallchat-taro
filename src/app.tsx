import { PropsWithChildren, useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import { ConfigProvider } from '@taroify/core'
import { store, RootState } from '@/store'
import { wsManager } from '@/services/websocket'

import '@taroify/core/index.css'
import '@taroify/icons/index.css'
import './app.scss'

const theme = {
  blue: '#0A84FF',
  primaryColor: '#0A84FF',
  dangerColor: '#FF3B30',
  successColor: '#34C759',
  warningColor: '#FF9F0A',
  backgroundColor: '#F5F9FF',
  textColor: '#111827',
  borderColor: 'rgba(84, 104, 129, 0.14)',
  buttonPrimaryBackgroundColor: '#0A84FF',
  buttonPrimaryBorderColor: '#0A84FF',
  buttonPrimaryColor: '#FFFFFF',
  buttonDefaultBackgroundColor: '#FFFFFF',
  buttonDefaultColor: '#111827',
  buttonBorderRadius: '999rpx',
  searchBackgroundColor: '#EAF3FF',
  searchContentBackgroundColor: '#FFFFFF',
  searchInputHeight: '76rpx',
  searchPadding: '10rpx 20rpx',
  searchBorderRadius: '999rpx',
  cellBackgroundColor: '#FFFFFF',
  cellBorderColor: 'rgba(84, 104, 129, 0.14)',
  cellLineHeight: '1.45',
  cellVerticalPadding: '26rpx',
  cellHorizontalPadding: '28rpx',
  badgeBackgroundColor: '#FF3B30',
  badgeBorderColor: '#FFFFFF',
  emptyDescriptionColor: '#94A3B8',
  skeletonAvatarBackgroundColor: '#EAF3FF',
  skeletonTitleBackgroundColor: '#EAF3FF',
  skeletonRowBackgroundColor: '#EEF4FB',
  avatarBackgroundColor: '#DDEBFF',
  navBarBackgroundColor: 'rgba(255, 255, 255, 0.82)',
} as const

function WebSocketProvider({ children }: PropsWithChildren) {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (isLoggedIn) {
      wsManager.connect()
    } else {
      wsManager.disconnect()
    }
    return () => {
      wsManager.disconnect()
    }
  }, [isLoggedIn])

  return <>{children}</>
}

function App({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </ConfigProvider>
    </Provider>
  )
}

export default App
