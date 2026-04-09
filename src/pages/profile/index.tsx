import { Text, View, Image } from '@tarojs/components'
import { Arrow, StarOutlined, AppsOutlined, GoldCoinOutlined } from '@taroify/icons'

import './index.scss'
import '../contact/index.scss'

export default function ProfileIndex() {
  return (
    <View className='mall-page'>
      <View className='mall-page__body'>
        <View className='profile-bg-header' />

        {/* Profile card */}
        <View className='profile-card'>
          <View className='profile-card__top'>
            <View className='profile-card__avatar-wrap'>
              <Image src='https://i.pravatar.cc/150?img=11' className='profile-card__avatar' />
              <View className='profile-card__online-dot' />
            </View>
            <View className='profile-card__main'>
              <Text className='profile-card__name'>前端攻城狮</Text>
              <Text className='profile-card__id'>账号: 123456789</Text>
            </View>
            <Arrow size='20px' style={{ color: '#C7C7CC' }} />
          </View>

          <View className='profile-card__stats'>
            <View className='profile-card__stat-item'>
              <Text className='profile-card__stat-val'>128</Text>
              <Text className='profile-card__stat-label'>空间访客</Text>
            </View>
            <View className='profile-card__stat-item'>
              <Text className='profile-card__stat-val'>45</Text>
              <Text className='profile-card__stat-label'>好友动态</Text>
            </View>
            <View className='profile-card__stat-item'>
              <Text className='profile-card__stat-val'>12</Text>
              <Text className='profile-card__stat-label'>我的收藏</Text>
            </View>
          </View>
        </View>

        {/* Service list */}
        <View className='profile-body'>
          <View className='ios-card-group'>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <GoldCoinOutlined size='24px' style={{ color: '#3B82F6', width: '48rpx', marginRight: '24rpx' }} />
              <View className='ios-card-item__content'>
                <Text className='ios-card-item__title'>我的钱包</Text>
                <Text className='ios-card-item__sub'>¥ 88.00</Text>
                <Arrow size='16px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <StarOutlined size='24px' style={{ color: '#FBBF24', width: '48rpx', marginRight: '24rpx' }} />
              <View className='ios-card-item__content last'>
                <Text className='ios-card-item__title'>我的收藏</Text>
                <Arrow size='16px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
          </View>

          <View className='ios-card-group'>
            <View className='ios-card-item' hoverClass='ios-card-item--pressed'>
              <AppsOutlined size='24px' style={{ color: '#F97316', width: '48rpx', marginRight: '24rpx' }} />
              <View className='ios-card-item__content last'>
                <Text className='ios-card-item__title'>小程序</Text>
                <Arrow size='16px' style={{ color: '#C7C7CC' }} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
