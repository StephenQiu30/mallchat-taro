import { ScrollView, Text, View } from '@tarojs/components'
import { Search, Cell } from '@taroify/core'
import { Arrow, FriendsOutlined, ChatOutlined } from '@taroify/icons'
import Taro, { useDidShow, setNavigationBarTitle } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '@/store/slices/appSlice'

import './index.scss'

const quickEntries = [
  {
    key: 'new-friends',
    title: '新朋友',
    desc: '好友申请与系统提醒',
    icon: <FriendsOutlined size='20px' style={{ color: '#fa8c16' }} />,
  },
  {
    key: 'group-notice',
    title: '群通知',
    desc: '群聊动态与提及提醒',
    icon: <ChatOutlined size='20px' style={{ color: '#2563eb' }} />,
    badge: '1',
  },
]

const favoriteContacts = [
  {
    id: 'mom',
    name: '老妈',
    status: '刚才在线',
    avatar: 'https://i.pravatar.cc/160?img=5',
  },
  {
    id: 'liang',
    name: '阿亮',
    status: '手机在线',
    avatar: 'https://i.pravatar.cc/160?img=32',
  },
]

/**
 * 联系人列表页
 */
export default function ContactIndex() {
  const dispatch = useDispatch()

  useDidShow(() => {
    dispatch(setActiveTab('contact'))
    setNavigationBarTitle({ title: '联系人' })
  })

  return (
    <View className='mall-page contact-page'>
      <ScrollView scrollY className='mall-page__scroll' enhanced showScrollbar={false}>
        <View className='mall-page__content'>
          <View className='contact-page__hero'>
            <Text className='contact-page__title'>联系人</Text>
            <Text className='contact-page__subtitle'>常用联系人、群提醒和协作入口</Text>
          </View>

          <View className='mall-search-wrapper'>
            <Search
              placeholder='搜索联系人、标签和分组'
            />
          </View>

          <View className='contact-page__quick-list'>
            <Cell.Group style={{ borderRadius: '24rpx', overflow: 'hidden', backgroundColor: '#fff' }}>
              {quickEntries.map((entry) => (
                <Cell
                  key={entry.key}
                  title={
                    <View style={{ display: 'flex', alignItems: 'center' }}>
                      {entry.icon}
                      <Text style={{ marginLeft: '20rpx' }}>{entry.title}</Text>
                    </View>
                  }
                  brief={entry.desc}
                  align='center'
                  rightIcon={
                    <View style={{ display: 'flex', alignItems: 'center' }}>
                      {entry.badge && <View className='mall-badge' style={{ marginRight: '16rpx' }}>{entry.badge}</View>}
                      <Arrow size='16px' style={{ color: '#bbb' }} />
                    </View>
                  }
                />
              ))}
            </Cell.Group>
          </View>

          <Text className='mall-section-title' style={{ marginTop: '32rpx' }}>特别关心</Text>
          <Cell.Group style={{ borderRadius: '24rpx', overflow: 'hidden', backgroundColor: '#fff' }}>
            {favoriteContacts.map((contact) => (
              <Cell
                key={contact.id}
                title={
                  <View style={{ display: 'flex', alignItems: 'center' }}>
                    <View className='contact-page__person-avatar-wrap'>
                      <View className='contact-page__person-avatar' style={{ background: '#f0f2f5', width: '80rpx', height: '80rpx', borderRadius: '20rpx' }} />
                      <View className='contact-page__person-online' />
                    </View>
                    <Text style={{ marginLeft: '20rpx' }}>{contact.name}</Text>
                  </View>
                }
                brief={contact.status}
                align='center'
                rightIcon={<Arrow size='16px' style={{ color: '#bbb' }} />}
              />
            ))}
          </Cell.Group>

          <Text className='mall-section-title' style={{ marginTop: '32rpx' }}>分组预览</Text>
          <Cell.Group style={{ borderRadius: '24rpx', overflow: 'hidden', backgroundColor: '#fff' }}>
            <Cell 
              title='我的好友' 
              rightIcon={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ fontSize: '24rpx', color: '#999', marginRight: '8rpx' }}>34 / 120 在线</Text>
                  <Arrow size='16px' style={{ color: '#bbb' }} />
                </View>
              } 
            />
            <Cell 
              title='项目群聊' 
              rightIcon={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ fontSize: '24rpx', color: '#999', marginRight: '8rpx' }}>12 个活跃群组</Text>
                  <Arrow size='16px' style={{ color: '#bbb' }} />
                </View>
              } 
            />
            <Cell 
              title='黑名单' 
              rightIcon={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ fontSize: '24rpx', color: '#999', marginRight: '8rpx' }}>无</Text>
                  <Arrow size='16px' style={{ color: '#bbb' }} />
                </View>
              } 
            />
          </Cell.Group>
        </View>
      </ScrollView>
    </View>
  )
}
