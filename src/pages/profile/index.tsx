import { ScrollView, Text, View } from '@tarojs/components'
import { Avatar, Cell, Tag } from '@taroify/core'
import { Arrow, GiftOutlined, StarOutlined, SettingOutlined, BalancePay, AppsOutlined } from '@taroify/icons'
import Taro, { useDidShow, setNavigationBarTitle } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '@/store/slices/appSlice'

import './index.scss'

const profileMenus = [
  {
    key: 'wallet',
    title: '我的钱包',
    desc: '账单、收支与会员权益',
    icon: <BalancePay size='18px' style={{ color: '#faad14' }} />,
  },
  {
    key: 'store',
    title: '装扮商城',
    desc: '主题皮肤与会话气泡',
    icon: <GiftOutlined size='18px' style={{ color: '#eb2f96' }} />,
  },
  {
    key: 'favorites',
    title: '收藏中心',
    desc: '保留重要消息与文件',
    icon: <StarOutlined size='18px' style={{ color: '#52c41a' }} />,
  },
  {
    key: 'mini-program',
    title: '精选小程序',
    desc: '最近访问与常用服务',
    icon: <AppsOutlined size='18px' style={{ color: '#13c2c2' }} />,
  },
  {
    key: 'settings',
    title: '系统设置',
    desc: '通知、隐私与布局偏好',
    icon: <SettingOutlined size='18px' style={{ color: '#8c8c8c' }} />,
  },
]

/**
 * 个人中心页
 */
export default function ProfileIndex() {
  const dispatch = useDispatch()

  useDidShow(() => {
    dispatch(setActiveTab('profile'))
    setNavigationBarTitle({ title: '空间' })
  })

  return (
    <View className='mall-page profile-page'>
      <ScrollView scrollY className='mall-page__scroll' enhanced showScrollbar={false}>
        <View className='mall-page__content'>
          <View className='profile-page__hero'>
            <View className='profile-page__hero-top'>
              <Avatar
                size='large'
                src='https://i.pravatar.cc/160?img=11'
                style={{ borderRadius: '28rpx', boxShadow: 'var(--shadow-strong)' }}
              />
              <View className='profile-page__hero-main'>
                <Text className='profile-page__name'>MallChat 用户</Text>
                <View style={{ display: 'flex', alignItems: 'center', marginTop: '4rpx' }}>
                  <Text className='profile-page__id'>账号: 888888</Text>
                  <Tag color='primary' style={{ marginLeft: '12rpx' }}>PRO</Tag>
                </View>
              </View>
              <Arrow size='18px' style={{ color: '#bbb' }} />
            </View>

            <View className='profile-page__stats'>
              {[
                { label: '访客', value: '128' },
                { label: '点赞', value: '45' },
                { label: '关注', value: '12' },
              ].map((item) => (
                <View key={item.label} className='profile-page__stat-card mall-surface'>
                  <Text className='profile-page__stat-value'>{item.value}</Text>
                  <Text className='profile-page__stat-label'>{item.label}</Text>
                </View>
              ))}
            </View>

            <View className='profile-page__summary mall-surface'>
              <Text className='profile-page__summary-title'>成长足迹</Text>
              <Text className='profile-page__summary-text'>
                最近 7 天内完成了 14 次沟通、3 次归档和 2 次协作体验。
              </Text>
            </View>
          </View>

          <Text className='mall-section-title' style={{ marginTop: '32rpx' }}>常用入口</Text>
          <Cell.Group style={{ borderRadius: '24rpx', overflow: 'hidden', backgroundColor: '#fff' }}>
            {profileMenus.map((item) => (
              <Cell
                key={item.key}
                title={
                  <View style={{ display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                    <Text style={{ marginLeft: '20rpx' }}>{item.title}</Text>
                  </View>
                }
                brief={item.desc}
                align='center'
                rightIcon={<Arrow size='16px' style={{ color: '#bbb' }} />}
              />
            ))}
          </Cell.Group>
        </View>
      </ScrollView>
    </View>
  )
}
