import { ScrollView, Text, View } from '@tarojs/components'
import { Search, Avatar } from '@taroify/core'
import Taro, { useDidShow, setNavigationBarTitle } from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '@/store/slices/appSlice'
import { MOCK_CONVERSATIONS } from '@/services/mockData'

import './index.scss'

/**
 * 消息列表页
 */
export default function MessageIndex() {
  const dispatch = useDispatch()
  const highlightedConversation = MOCK_CONVERSATIONS[0]
  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, item) => sum + item.unread, 0)
  const onlineCount = MOCK_CONVERSATIONS.filter((item) => item.online).length

  useDidShow(() => {
    dispatch(setActiveTab('message'))
    setNavigationBarTitle({ title: 'MallChat' })
  })

  return (
    <View className='mall-page message-page'>
      <ScrollView
        scrollY
        className='mall-page__scroll'
        enhanced
        showScrollbar={false}
      >
        <View className='mall-page__content'>
          {/* Header Hero */}
          <View className='message-page__hero'>
            <View className='message-page__identity'>
              <View className='message-page__hero-avatar'>
                <Avatar
                  size='large'
                  src='https://i.pravatar.cc/160?img=1'
                  style={{ borderRadius: '28rpx', boxShadow: 'var(--shadow-strong)' }}
                />
              </View>
              <View className='message-page__identity-copy'>
                <Text className='message-page__title'>消息中心</Text>
                <Text className='message-page__subtitle'>重要会话、群聊提醒和工作沟通</Text>
              </View>
            </View>

            <View className='message-page__stats'>
              <View className='message-page__stat-card mall-surface'>
                <Text className='message-page__stat-value'>{totalUnread}</Text>
                <Text className='message-page__stat-label'>未读消息</Text>
              </View>
              <View className='message-page__stat-card mall-surface'>
                <Text className='message-page__stat-value'>{onlineCount}</Text>
                <Text className='message-page__stat-label'>在线联系</Text>
              </View>
            </View>
          </View>

          {/* Taroify Search */}
          <View className='mall-search-wrapper'>
            <Search
              placeholder='搜索联系人、群聊和文件'
              style={{ background: 'transparent', padding: '16rpx 0' }}
            />
          </View>

          {/* Featured Highlight */}
          {highlightedConversation && (
            <View
              className='message-page__featured'
              hoverClass='is-pressed'
              onClick={() =>
                Taro.navigateTo({
                  url: `/pages/chat/index?id=${highlightedConversation.id}&name=${highlightedConversation.name}`,
                })
              }
            >
              <View className='message-page__featured-tag'>置顶会话</View>
              <Text className='message-page__featured-title'>
                {highlightedConversation.name}
              </Text>
              <Text className='message-page__featured-text'>
                {highlightedConversation.text}
              </Text>
              <View className='message-page__featured-meta'>
                <Text className='message-page__featured-time'>{highlightedConversation.time}</Text>
                {highlightedConversation.unread > 0 && (
                  <View className='mall-badge'>{highlightedConversation.unread}</View>
                )}
              </View>
            </View>
          )}

          <Text className='mall-section-title'>最近消息</Text>
          <View className='message-list'>
            {MOCK_CONVERSATIONS.map((msg) => (
              <View
                key={msg.id}
                className='message-card mall-surface'
                hoverClass='is-pressed'
                onClick={() => Taro.navigateTo({ url: `/pages/chat/index?id=${msg.id}&name=${msg.name}` })}
              >
                <View className='message-card__avatar-wrap'>
                  <Avatar
                    size='medium'
                    src={msg.avatar}
                    className='message-card__avatar'
                  />
                  {msg.online && <View className='message-card__online' />}
                  {msg.unread > 0 && (
                    <View className='message-card__badge mall-badge'>{msg.unread}</View>
                  )}
                </View>

                <View className='message-card__body'>
                  <View className='message-card__header'>
                    <Text className='message-card__name mall-text-ellipsis'>{msg.name}</Text>
                    <Text className='message-card__time'>{msg.time}</Text>
                  </View>
                  <Text className='message-card__text mall-text-ellipsis'>{msg.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
