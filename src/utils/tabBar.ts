import Taro from '@tarojs/taro'

type CustomTabBarInstance = {
  setSelected: (index: number) => void
}

export function syncTabBar(index: number) {
  if (process.env.TARO_ENV !== 'weapp') {
    return
  }

  try {
    const page = Taro.getCurrentInstance().page

    if (!page) {
      return
    }

    const tabBar = Taro.getTabBar(page) as CustomTabBarInstance | undefined
    tabBar?.setSelected(index)
  } catch {
    // 当前走原生 tabBar 或产物未生成 custom-tab-bar 时，忽略同步。
  }
}
