/**
 * 模拟对话列表数据 (首页)
 */
export const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'MallChat 助手',
    text: '欢迎来到 MallChat！这是一个基于 Taro 的跨端商城聊天系统。',
    time: '12:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=assistant',
    unread: 2,
    online: true
  },
  {
    id: '2',
    name: '阿亮',
    text: '最近那篇关于 React 性能优化的文章看了吗？',
    time: '昨天',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aliang',
    unread: 0,
    online: true
  },
  {
    id: '3',
    name: '产品经理-老王',
    text: '下午 3 点有个需求评审会，记得参加。',
    time: '星期一',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    unread: 5,
    online: false
  },
  {
    id: '4',
    name: '设计妹子-小红',
    text: '新的 UI 稿已经上传到蓝湖了，帮我康康~',
    time: '2024-03-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=red',
    unread: 0,
    online: true
  }
]

/**
 * 模拟详情对话数据 (聊天详情页)
 */
export const MOCK_CHATS = {
  '2': [
    {
      id: '101',
      senderId: 'other',
      senderName: '阿亮',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aliang',
      content: '最近那篇关于 React 性能优化的文章看了吗？',
      time: '昨天 10:20',
      type: 'text'
    },
    {
      id: '102',
      senderId: 'me',
      senderName: '我',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      content: '还没呢，最近在忙 MallChat 的 UI 重构，发我看看？',
      time: '昨天 10:25',
      type: 'text'
    }
  ],
  '4': [
    {
      id: '201',
      senderId: 'other',
      senderName: '设计妹子-小红',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=red',
      content: '新的 UI 稿已经上传到蓝湖了，帮我康康~',
      time: '2024-03-20 14:20',
      type: 'text'
    },
    {
      id: '202',
      senderId: 'other',
      senderName: '设计妹子-小红',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=red',
      content: 'mallchat_ui_v2.0.sketch (45 MB)',
      time: '2024-03-20 14:30',
      type: 'file',
      fileName: 'mallchat_ui_v2.0.sketch',
      fileSize: '45 MB'
    }
  ]
}

export const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
