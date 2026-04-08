import { Input, Text, View } from '@tarojs/components'
import { AddOutlined, Bell, Friends, Search } from '@taroify/icons'
import Taro, { useDidShow } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '@/store/slices/appSlice'
import { MOCK_CONVERSATIONS } from '@/services/mockData'
import { syncTabBar } from '@/utils/tabBar'

import './index.scss'

export default function MessageIndex() {
  const dispatch = useDispatch()
  const listData = MOCK_CONVERSATIONS
  const unreadSessions = listData.filter((item) => item.unread || item.showUnreadDot).length
  const mentionCount = listData.filter((item) => item.highlight).length

  useDidShow(() => {
    dispatch(setActiveTab('message'))
    syncTabBar(0)
  })

  return (
    <View className='mall-page message-page'>
      <View className='mall-floating-orb message-page__orb message-page__orb--top' />
      <View className='mall-floating-orb message-page__orb message-page__orb--bottom' />

      <View className='message-page__header'>
        <View className='message-page__header-left'>
          <View className='mall-avatar mall-avatar--circle mall-avatar--slate message-page__my-avatar'>
            <Text>我</Text>
          </View>
          <View>
            <Text className='message-page__page-title'>消息</Text>
            <Text className='message-page__page-subtitle'>{unreadSessions} 个会话待处理</Text>
          </View>
        </View>
        <View className='message-page__add-btn'>
          <AddOutlined size='20px' />
        </View>
      </View>

      <View className='mall-page__body'>
        <View className='mall-page__content'>
          <View className='mall-search'>
            <Search size='18px' style={{ color: '#8fa0b7' }} />
            <Input
              className='mall-search__input'
              placeholder='搜索'
              placeholderStyle='color: #8fa0b7;'
            />
          </View>

          <View className='message-page__summary'>
            <View className='message-page__summary-chip'>
              <Text className='message-page__summary-value'>{unreadSessions}</Text>
              <Text className='message-page__summary-label'>未读会话</Text>
            </View>
            <View className='message-page__summary-chip'>
              <Text className='message-page__summary-value'>{mentionCount}</Text>
              <Text className='message-page__summary-label'>群提醒</Text>
            </View>
          </View>

          <View className='message-page__list'>
            {listData.map((msg) => (
              <View
                key={msg.id}
                className={`message-card message-card--${msg.type}`}
                hoverClass='message-card--pressed'
                hoverStayTime={60}
                onClick={() => Taro.navigateTo({ url: `/pages/chat/index?id=${msg.id}&name=${msg.name}` })}
              >
                <View className='message-card__avatar-wrap'>
                  {msg.type === 'group' && (
                    <View className={`mall-avatar mall-avatar--rounded mall-avatar--${msg.avatarTone} message-card__avatar-box`}>
                      <Friends size='22px' style={{ color: '#fff' }} />
                    </View>
                  )}
                  {msg.type === 'service' && (
                    <View className={`mall-avatar mall-avatar--rounded mall-avatar--${msg.avatarTone} message-card__avatar-box`}>
                      <Bell size='22px' style={{ color: '#fff' }} />
                    </View>
                  )}
                  {msg.type === 'direct' && (
                    <View className={`mall-avatar mall-avatar--circle mall-avatar--${msg.avatarTone} message-card__avatar-box`}>
                      <Text className='message-card__avatar-text'>{msg.avatarLabel}</Text>
                    </View>
                  )}

                  {msg.online && msg.type === 'direct' && <View className='message-card__online' />}
                  {!!msg.unread && <View className='message-card__badge-num'>{msg.unread}</View>}
                  {msg.showUnreadDot && <View className='message-card__badge-dot' />}
                </View>

                <View className='message-card__body'>
                  <View className='message-card__row'>
                    <Text className='message-card__name mall-text-ellipsis'>
                      {msg.name}
                      {msg.memberCount ? ` (${msg.memberCount})` : ''}
                    </Text>
                    <Text className='message-card__time'>{msg.time}</Text>
                  </View>
                  <Text className='message-card__text mall-text-ellipsis'>
                    {msg.highlight && <Text className='message-card__highlight'>{msg.highlight} </Text>}
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
