import { PropsWithChildren } from 'react'
import { RootProviders } from '@/layout/Providers'
import { RootLayout } from '@/layout'

import './app.css'

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
