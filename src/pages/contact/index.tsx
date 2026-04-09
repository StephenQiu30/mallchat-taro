import { Input, Text, View, Image } from '@tarojs/components'
import { Search, Manager, Friends, ArrowDown, Arrow } from '@taroify/icons'

import './index.scss'

export default function ContactIndex() {
  return (
    <View className='mall-page'>
      {/* Search */}
      <View className='ios-search'>
        <View className='ios-search__inner'>
          <Search size='16px' style={{ color: '#8E8E93' }} />
          <Input
            className='ios-search__input'
            placeholder='搜索联系人'
            placeholderStyle='color: #8E8E93;'
          />
        </View>
      </View>

      <View className='mall-page__body'>
        <View className='contact-body'>
          {/* Function entries card */}
          <View className='ios-card-group'>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <View className='ios-card-item__icon mall-avatar mall-avatar--orange'>
                <Manager size='24px' />
              </View>
              <View className='ios-card-item__content'>
                <Text className='ios-card-item__title'>新朋友</Text>
                <Arrow size='16px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <View className='ios-card-item__icon mall-avatar mall-avatar--blue'>
                <Friends size='24px' />
              </View>
              <View className='ios-card-item__content last'>
                <Text className='ios-card-item__title'>群通知</Text>
                <Text className='ios-card-item__badge'>1</Text>
                <Arrow size='16px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
          </View>

          {/* Friends section */}
          <Text className='contact-group-header'>我的好友</Text>
          <View className='ios-card-group'>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <ArrowDown size='16px' style={{ color: '#8E8E93', marginRight: '16rpx' }} />
              <View className='ios-card-item__content'>
                <Text className='ios-card-item__title'>特别关心</Text>
                <Text className='ios-card-item__sub'>1/1</Text>
              </View>
            </View>
            <View className='friend-item' hoverClass='friend-item--pressed'>
              <Image src='https://i.pravatar.cc/150?img=5' className='friend-item__avatar' />
              <View className='friend-item__main'>
                <Text className='friend-item__name'>老妈</Text>
                <Text className='friend-item__status'>4G在线</Text>
              </View>
            </View>

            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <Arrow size='16px' style={{ color: '#8E8E93', marginRight: '16rpx' }} />
              <View className='ios-card-item__content'>
                <Text className='ios-card-item__title'>大学同学</Text>
                <Text className='ios-card-item__sub'>12/45</Text>
              </View>
            </View>

            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <Arrow size='16px' style={{ color: '#8E8E93', marginRight: '16rpx' }} />
              <View className='ios-card-item__content last'>
                <Text className='ios-card-item__title'>工作伙伴</Text>
                <Text className='ios-card-item__sub'>34/120</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
