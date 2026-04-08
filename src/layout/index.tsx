import { PropsWithChildren } from 'react'

/**
 * 全局根布局 - 已还原为原生模式
 */
export function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
    </>
  )
}
