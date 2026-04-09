import { Input, Text, View, Image } from '@tarojs/components'
import { Search } from '@taroify/icons'
import Taro from '@tarojs/taro'

import { MOCK_CONVERSATIONS } from '@/services/mockData'

import './index.scss'

export default function MessageIndex() {
  const listData = MOCK_CONVERSATIONS || []

  return (
    <View className='mall-page'>
      {/* Search bar */}
      <View className='ios-search'>
        <View className='ios-search__inner'>
          <Search size='16px' style={{ color: '#8E8E93' }} />
          <Input
            className='ios-search__input'
            placeholder='搜索'
            placeholderStyle='color: #8E8E93;'
          />
        </View>
      </View>

      {/* Scrollable message list */}
      <View className='mall-page__body'>
        <View className='message-list'>
          {listData.map((msg) => (
            <View
              key={msg.id}
              className='message-item'
              hoverClass='message-item--pressed'
              hoverStayTime={80}
              onClick={() => Taro.navigateTo({ url: `/pages/chat/index?id=${msg.id}&name=${encodeURIComponent(msg.name)}` })}
            >
              <View className='message-item__avatar-wrap'>
                <Image src={`https://i.pravatar.cc/150?u=${msg.id}`} className='message-item__avatar-img' />
                {!!msg.unread && Number(msg.unread) > 0 && (
                  <View className='message-item__badge'>{msg.unread}</View>
                )}
                {msg.showUnreadDot && <View className='message-item__dot' />}
              </View>

              <View className='message-item__content'>
                <View className='message-item__row'>
                  <Text className='message-item__name mall-text-ellipsis'>{msg.name}</Text>
                  <Text className='message-item__time'>{msg.time}</Text>
                </View>
                <Text className='message-item__text mall-text-ellipsis'>
                  {msg.highlight && <Text className='message-item__highlight'>{msg.highlight} </Text>}
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
