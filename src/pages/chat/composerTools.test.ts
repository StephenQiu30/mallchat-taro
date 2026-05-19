import { describe, expect, it } from 'vitest'
import {
  CHAT_COMPOSER_PLACEHOLDERS,
  EMPTY_COMPOSER_TOOLS,
  shouldShowSendAction,
} from './composerTools'

describe('chat composer tools', () => {
  it('shows send action only when input has visible content', () => {
    expect(shouldShowSendAction('')).toBe(false)
    expect(shouldShowSendAction('   ')).toBe(false)
    expect(shouldShowSendAction('你好')).toBe(true)
  })

  it('keeps the common IM tools visible for an empty composer', () => {
    expect(EMPTY_COMPOSER_TOOLS.map((tool) => tool.id)).toEqual([
      'voice',
      'emoji',
      'image',
      'more',
    ])
  })

  it('documents placeholder actions for unfinished tools', () => {
    expect(CHAT_COMPOSER_PLACEHOLDERS.voice).toBe('语音消息后续开放')
    expect(CHAT_COMPOSER_PLACEHOLDERS.emoji).toBe('表情面板后续开放')
    expect(CHAT_COMPOSER_PLACEHOLDERS.more).toBe('更多工具后续开放')
  })
})
