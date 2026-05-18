import { View, Text, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Avatar } from '@taroify/core'
import ListStatus from '@/components/ListStatus'

import './index.scss'

interface MomentItem {
  id: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  images?: string[]
  time: string
  likes: number
  comments: number
}

const placeholderMoments: MomentItem[] = [
  {
    id: 1,
    userId: 1001,
    userName: '产品经理小王',
    userAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=1001',
    content: '今天团队完成了新版本的需求评审，下周开始开发！💪',
    time: '2小时前',
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    userId: 1002,
    userName: '设计师小李',
    userAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=1002',
    content: '分享一下最近的设计作品，欢迎大家提意见～',
    images: [
      'https://picsum.photos/200/200?random=1',
      'https://picsum.photos/200/200?random=2',
      'https://picsum.photos/200/200?random=3',
    ],
    time: '5小时前',
    likes: 28,
    comments: 8,
  },
  {
    id: 3,
    userId: 1003,
    userName: '开发小张',
    userAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=1003',
    content: '终于把这个难搞的 bug 修好了，开心！🎉',
    time: '昨天',
    likes: 15,
    comments: 5,
  },
]

export default function MomentsPage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)

  if (!isLoggedIn) {
    return (
      <View className='mall-page moments-page'>
        <ListStatus kind='login' description='登录后查看好友动态' />
      </View>
    )
  }

  return (
    <View className='mall-page moments-page'>
      <View className='moments__header'>
        <Text className='moments__header-title'>好友动态</Text>
        <Text className='moments__header-desc'>看看朋友们在做什么</Text>
      </View>

      {placeholderMoments.length === 0 ? (
        <View className='moments__empty'>
          <Text className='moments__empty-icon'>📝</Text>
          <Text className='moments__empty-title'>暂无动态</Text>
          <Text className='moments__empty-desc'>
            好友发布动态后会在这里显示{'\n'}快去邀请好友一起使用吧
          </Text>
        </View>
      ) : (
        <View className='moments__list'>
          {placeholderMoments.map((moment) => (
            <View key={moment.id} className='moments__item'>
              <View className='moments__item-header'>
                <Avatar
                  className='moments__item-avatar'
                  src={moment.userAvatar}
                  style={{ width: '80rpx', height: '80rpx' }}
                />
                <View className='moments__item-info'>
                  <Text className='moments__item-name'>{moment.userName}</Text>
                  <Text className='moments__item-time'>{moment.time}</Text>
                </View>
              </View>

              <Text className='moments__item-content'>{moment.content}</Text>

              {moment.images && moment.images.length > 0 && (
                <View className='moments__item-images'>
                  {moment.images.map((img, idx) => (
                    <Image
                      key={idx}
                      className='moments__item-image'
                      src={img}
                      mode='aspectFill'
                    />
                  ))}
                </View>
              )}

              <View className='moments__item-actions'>
                <View className='moments__item-action'>
                  <Text>👍 {moment.likes}</Text>
                </View>
                <View className='moments__item-action'>
                  <Text>💬 {moment.comments}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
