import { PropsWithChildren } from 'react'
import { RootProviders } from '@/layout/Providers'
import { RootLayout } from '@/layout'

import '@taroify/core/index.css'
import '@taroify/icons/index.css'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  return (
    <RootProviders>
      <RootLayout>
        {children}
      </RootLayout>
    </RootProviders>
  )
}

export default App
