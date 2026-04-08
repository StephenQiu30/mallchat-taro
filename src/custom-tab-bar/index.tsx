import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { Comment, Friends, UserCircleOutlined } from '@taroify/icons'
import Taro from '@tarojs/taro'

import './index.scss'

const TABS = [
  {
    key: 'message',
    text: '消息',
    icon: (color) => <Comment size='24px' style={{ color }} />,
    path: 'pages/index/index',
    badge: '4',
  },
  {
    key: 'contact',
    text: '联系人',
    icon: (color) => <Friends size='24px' style={{ color }} />,
    path: 'pages/contact/index',
  },
  {
    key: 'profile',
    text: '我的',
    icon: (color) => <UserCircleOutlined size='24px' style={{ color }} />,
    path: 'pages/profile/index',
    dot: true,
  },
]

/**
 * 自定义 TabBar - 官方推荐类组件版
 * 这是解决 Taro 3 TabBar 隔离问题的最终方案
 */
export default class CustomTabBar extends Component<object, { selected: number }> {
  state = {
    selected: 0,
  }

  // 必须暴露的方法，供页面 getTabBar 调用
  setSelected(index: number) {
    this.setState({
      selected: index,
    })
  }

  handleSwitch(index: number, path: string) {
    this.setSelected(index)
    Taro.switchTab({
      url: `/${path}`,
    })
  }

  render() {
    const { selected } = this.state

    return (
      <View className='custom-tab-bar'>
        <View className='custom-tab-bar__shadow' />
        <View className='custom-tab-bar__inner'>
          {TABS.map((tab, index) => {
            const isActive = selected === index
            const activeColor = '#2f6bff'
            const inactiveColor = '#92a0b4'
            const currentColor = isActive ? activeColor : inactiveColor

            return (
              <View
                key={tab.key}
                className={`custom-tab-bar__item ${isActive ? 'is-active' : ''}`}
                onClick={() => this.handleSwitch(index, tab.path)}
              >
                <View className={`custom-tab-bar__icon-wrap ${isActive ? 'is-active' : ''}`}>
                  {tab.icon(currentColor)}
                  {tab.badge && <View className='custom-tab-bar__badge'>{tab.badge}</View>}
                  {tab.dot && <View className='custom-tab-bar__dot' />}
                </View>
                <Text className='custom-tab-bar__text' style={{ color: currentColor }}>
                  {tab.text}
                </Text>
              </View>
            )
          })}
        </View>
        <View className='mall-ios-indicator' />
      </View>
    )
  }
}
