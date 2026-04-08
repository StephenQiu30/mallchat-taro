import { Input, Text, View } from '@tarojs/components'
import { AddOutlined, Arrow, ArrowDown, Comment, Friends, Search } from '@taroify/icons'
import { useDidShow } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '@/store/slices/appSlice'
import { syncTabBar } from '@/utils/tabBar'

import './index.scss'

const quickEntries = [
  {
    key: 'new-friends',
    title: '新朋友',
    subtitle: '2 个申请待处理',
    icon: <Friends size='20px' style={{ color: '#f97316' }} />,
    tone: 'is-orange',
  },
  {
    key: 'group-notice',
    title: '群通知',
    subtitle: '1 条重要提醒',
    icon: <Comment size='20px' style={{ color: '#2f6bff' }} />,
    tone: 'is-blue',
    badge: '1',
  },
]

const friendGroups = [
  {
    id: 'fav',
    name: '特别关心',
    count: '1/1',
    expanded: true,
    friends: [
      { id: 'mom', name: '老妈', status: '4G在线', avatarLabel: '妈', avatarTone: 'rose' },
    ],
  },
  {
    id: 'college',
    name: '大学同学',
    count: '12/45',
    expanded: false,
    friends: [],
  },
  {
    id: 'work',
    name: '工作伙伴',
    count: '34/120',
    expanded: false,
    friends: [],
  },
]

export default function ContactIndex() {
  const dispatch = useDispatch()

  useDidShow(() => {
    dispatch(setActiveTab('contact'))
    syncTabBar(1)
  })

  return (
    <View className='mall-page contact-page'>
      <View className='mall-floating-orb contact-page__orb contact-page__orb--top' />
      <View className='mall-floating-orb contact-page__orb contact-page__orb--bottom' />

      <View className='contact-page__header'>
        <View className='contact-page__header-spacer' />
        <View className='contact-page__header-copy'>
          <Text className='contact-page__page-title'>联系人</Text>
          <Text className='contact-page__page-subtitle'>按分组快速找到常聊的人</Text>
        </View>
        <View className='contact-page__add-btn'>
          <AddOutlined size='20px' />
        </View>
      </View>

      <View className='mall-page__body'>
        <View className='mall-page__content'>
          <View className='mall-search'>
            <Search size='18px' style={{ color: '#8fa0b7' }} />
            <Input
              className='mall-search__input'
              placeholder='搜索联系人'
              placeholderStyle='color: #8fa0b7;'
            />
          </View>

          <View className='contact-page__functional'>
            {quickEntries.map((entry, index) => (
              <View
                key={entry.key}
                className={`contact-page__func-item ${entry.tone} ${index < quickEntries.length - 1 ? 'has-border' : ''}`}
                hoverClass='contact-page__func-item--pressed'
                hoverStayTime={60}
              >
                <View className='contact-page__func-icon'>{entry.icon}</View>
                <View className='contact-page__func-copy'>
                  <Text className='contact-page__func-title'>{entry.title}</Text>
                  <Text className='contact-page__func-subtitle'>{entry.subtitle}</Text>
                </View>
                <View className='contact-page__func-right'>
                  {entry.badge && <View className='contact-page__badge'>{entry.badge}</View>}
                  <Arrow size='14px' style={{ color: '#b4bfd1' }} />
                </View>
              </View>
            ))}
          </View>

          <Text className='contact-page__section-label'>我的好友</Text>
          <View className='contact-page__groups'>
            {friendGroups.map((group) => (
              <View key={group.id} className='contact-page__group-card'>
                <View className='contact-page__group-header'>
                  {group.expanded ? (
                    <ArrowDown size='14px' style={{ color: '#95a2b6' }} />
                  ) : (
                    <Arrow size='14px' style={{ color: '#95a2b6' }} />
                  )}
                  <Text className='contact-page__group-name'>{group.name}</Text>
                  <Text className='contact-page__group-count'>{group.count}</Text>
                </View>

                {group.expanded && group.friends.map((friend) => (
                  <View key={friend.id} className='contact-page__friend-item'>
                    <View className={`mall-avatar mall-avatar--circle mall-avatar--${friend.avatarTone} contact-page__friend-avatar`}>
                      <Text className='contact-page__friend-avatar-text'>{friend.avatarLabel}</Text>
                    </View>
                    <View className='contact-page__friend-info'>
                      <Text className='contact-page__friend-name'>{friend.name}</Text>
                      <Text className='contact-page__friend-status'>{friend.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
