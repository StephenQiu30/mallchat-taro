import { Text, View } from '@tarojs/components'
import { AppsOutlined, Arrow, BalancePay, Play, Qr, Setting, ShopOutlined, Star } from '@taroify/icons'
import { useDidShow } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '@/store/slices/appSlice'
import { syncTabBar } from '@/utils/tabBar'

import './index.scss'

const stats = [
  { label: '空间访客', value: '128' },
  { label: '好友动态', value: '45' },
  { label: '我的收藏', value: '12' },
]

const primaryMenus = [
  {
    key: 'wallet',
    title: '我的钱包',
    desc: '¥ 88.00',
    icon: <BalancePay size='20px' style={{ color: '#2f6bff' }} />,
    tone: 'is-blue',
  },
  {
    key: 'dress',
    title: '个性装扮',
    icon: <ShopOutlined size='20px' style={{ color: '#8b5cf6' }} />,
    tone: 'is-violet',
  },
  {
    key: 'favorite',
    title: '我的收藏',
    icon: <Star size='20px' style={{ color: '#f59e0b' }} />,
    tone: 'is-amber',
  },
]

const utilityMenus = [
  {
    key: 'game',
    title: '游戏中心',
    icon: <Play size='20px' style={{ color: '#22c55e' }} />,
    tone: 'is-green',
    dot: true,
  },
  {
    key: 'mini-app',
    title: '小程序',
    icon: <AppsOutlined size='20px' style={{ color: '#f97316' }} />,
    tone: 'is-orange',
  },
]

export default function ProfileIndex() {
  const dispatch = useDispatch()

  useDidShow(() => {
    dispatch(setActiveTab('profile'))
    syncTabBar(2)
  })

  return (
    <View className='mall-page profile-page'>
      <View className='profile-page__bg-shell'>
        <View className='profile-page__bg-orb profile-page__bg-orb--one' />
        <View className='profile-page__bg-orb profile-page__bg-orb--two' />
      </View>

      <View className='profile-page__header'>
        <View className='profile-page__header-spacer' />
        <Text className='profile-page__page-title'>我的</Text>
        <View className='profile-page__header-right'>
          <Setting size='20px' />
        </View>
      </View>

      <View className='mall-page__body'>
        <View className='mall-page__content'>
          <View className='profile-page__card'>
            <View className='profile-page__user-info'>
              <View className='mall-avatar mall-avatar--circle mall-avatar--slate profile-page__avatar'>
                <Text className='profile-page__avatar-text'>我</Text>
              </View>
              <View className='profile-page__user-main'>
                <View className='profile-page__user-row'>
                  <Text className='profile-page__user-name'>前端攻城狮</Text>
                  <View className='profile-page__status-pill'>
                    <Text className='profile-page__status-text'>在线</Text>
                  </View>
                </View>
                <View className='profile-page__user-id-wrap'>
                  <Text className='profile-page__user-id'>账号: 123456789</Text>
                  <Qr size='14px' style={{ color: '#99a7bd' }} />
                </View>
              </View>
              <Arrow size='16px' style={{ color: '#c2cad9' }} />
            </View>

            <View className='profile-page__stats-row'>
              {stats.map((item) => (
                <View key={item.label} className='profile-page__stat-item'>
                  <Text className='profile-page__stat-val'>{item.value}</Text>
                  <Text className='profile-page__stat-lab'>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className='profile-page__menu-group'>
            {primaryMenus.map((item, index) => (
              <View
                key={item.key}
                className={`profile-page__menu-item ${item.tone} ${index < primaryMenus.length - 1 ? 'has-border' : ''}`}
                hoverClass='profile-page__menu-item--pressed'
                hoverStayTime={60}
              >
                <View className='profile-page__menu-icon'>{item.icon}</View>
                <Text className='profile-page__menu-title'>{item.title}</Text>
                {item.desc && <Text className='profile-page__menu-desc'>{item.desc}</Text>}
                <Arrow size='14px' style={{ color: '#b7c1d2' }} />
              </View>
            ))}
          </View>

          <View className='profile-page__menu-group'>
            {utilityMenus.map((item, index) => (
              <View
                key={item.key}
                className={`profile-page__menu-item ${item.tone} ${index < utilityMenus.length - 1 ? 'has-border' : ''}`}
                hoverClass='profile-page__menu-item--pressed'
                hoverStayTime={60}
              >
                <View className='profile-page__menu-icon'>{item.icon}</View>
                <Text className='profile-page__menu-title'>{item.title}</Text>
                {item.dot && <View className='profile-page__dot' />}
                <Arrow size='14px' style={{ color: '#b7c1d2' }} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
