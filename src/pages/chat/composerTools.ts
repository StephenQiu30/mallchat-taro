export type ChatComposerToolId = 'voice' | 'emoji' | 'image' | 'more'

export const CHAT_COMPOSER_PLACEHOLDERS = {
  voice: '语音消息后续开放',
  emoji: '表情面板后续开放',
  more: '更多工具后续开放',
} as const

export const EMPTY_COMPOSER_TOOLS: Array<{ id: ChatComposerToolId; label: string }> = [
  { id: 'voice', label: '语音' },
  { id: 'emoji', label: '表情' },
  { id: 'image', label: '图片' },
  { id: 'more', label: '更多' },
]

export function shouldShowSendAction(value: string) {
  return value.trim().length > 0
}
