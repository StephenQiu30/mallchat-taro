export type AvatarTone = 'sky' | 'violet' | 'mint' | 'amber' | 'rose' | 'slate'

export interface ConversationItem {
  id: string
  name: string
  text: string
  time: string
  unread?: number
  online?: boolean
  type: 'group' | 'direct' | 'service'
  memberCount?: number
  highlight?: string
  showUnreadDot?: boolean
  avatarLabel: string
  avatarTone: AvatarTone
}

export interface ChatMessage {
  id: string
  senderId: 'me' | 'other'
  senderName: string
  avatarLabel: string
  avatarTone: AvatarTone
  content: string
  time: string
  type: 'text' | 'file'
  fileName?: string
  fileSize?: string
}

/**
 * 模拟对话列表数据 (首页)
 */
export const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: '1',
    name: '前端开发交流群',
    text: '王总: 那个 H5 页面的原型出来了没？',
    time: '14:20',
    type: 'group',
    memberCount: 128,
    highlight: '[有人@我]',
    showUnreadDot: true,
    avatarLabel: '群',
    avatarTone: 'sky',
  },
  {
    id: '2',
    name: 'UI设计师 - 小李',
    text: '切图文件我已经发到群里了，你看一下尺寸对不对。',
    time: '昨天',
    unread: 3,
    online: true,
    type: 'direct',
    avatarLabel: '李',
    avatarTone: 'rose',
  },
  {
    id: '3',
    name: '产品经理 - 张哥',
    text: '好的，那就按这个交互逻辑来做。',
    time: '星期二',
    type: 'direct',
    avatarLabel: '张',
    avatarTone: 'amber',
  },
  {
    id: '4',
    name: '服务通知',
    text: '您的云服务器已成功续费。',
    time: '10-12',
    type: 'service',
    avatarLabel: '服',
    avatarTone: 'violet',
  },
  {
    id: '5',
    name: '林妹妹',
    text: '[动画表情]',
    time: '10-10',
    type: 'direct',
    avatarLabel: '林',
    avatarTone: 'mint',
  },
]

/**
 * 模拟详情对话数据 (聊天详情页)
 */
export const MOCK_CHATS: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '001',
      senderId: 'other',
      senderName: '王总',
      avatarLabel: '王',
      avatarTone: 'amber',
      content: '那个 H5 页面的原型出来了没？今天下班前需要过一遍。',
      time: '昨天 14:20',
      type: 'text',
    },
    {
      id: '002',
      senderId: 'me',
      senderName: '我',
      avatarLabel: '我',
      avatarTone: 'sky',
      content: '已经在联调了，今晚我把新版首页和聊天页一起发群里。',
      time: '昨天 14:22',
      type: 'text',
    },
  ],
  '2': [
    {
      id: '101',
      senderId: 'other',
      senderName: 'UI设计师 - 小李',
      avatarLabel: '李',
      avatarTone: 'rose',
      content: '切图文件我已经发到群里了，你看一下尺寸对不对。还有图标需要换成 SVG 格式的吗？',
      time: '昨天 14:20',
      type: 'text',
    },
    {
      id: '102',
      senderId: 'me',
      senderName: '我',
      avatarLabel: '我',
      avatarTone: 'sky',
      content: '收到了，尺寸没问题。图标最好是 SVG 的，这样在高清屏上不会模糊。',
      time: '昨天 14:23',
      type: 'text',
    },
    {
      id: '103',
      senderId: 'other',
      senderName: 'UI设计师 - 小李',
      avatarLabel: '李',
      avatarTone: 'rose',
      content: 'icons_v2.zip',
      time: '昨天 14:30',
      type: 'file',
      fileName: 'icons_v2.zip',
      fileSize: '1.2 MB',
    },
  ],
  '3': [
    {
      id: '301',
      senderId: 'other',
      senderName: '产品经理 - 张哥',
      avatarLabel: '张',
      avatarTone: 'amber',
      content: '好的，那就按这个交互逻辑来做。',
      time: '星期二 11:10',
      type: 'text',
    },
  ],
  '4': [
    {
      id: '201',
      senderId: 'other',
      senderName: '服务通知',
      avatarLabel: '服',
      avatarTone: 'violet',
      content: '您的云服务器已成功续费，服务有效期已延长至 2026-12-31。',
      time: '2024-03-20 14:20',
      type: 'text',
    },
  ],
}
