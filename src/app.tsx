import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store'

// 核心样式
import '@taroify/icons/index.css'
import './app.scss'

function App({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default App
