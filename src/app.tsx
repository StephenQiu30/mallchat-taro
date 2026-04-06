import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { RootLayout } from './layout'

import './app.css'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // 1. Using centralized RootLayout pattern from the layout module
  return (
    <RootLayout>
      {children}
    </RootLayout>
  )
}

export default App
