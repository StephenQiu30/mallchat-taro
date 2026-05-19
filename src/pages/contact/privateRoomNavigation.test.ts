import { describe, expect, it, vi } from 'vitest'
import { createPrivateRoomNavigation } from './privateRoomNavigation'

describe('createPrivateRoomNavigation', () => {
  it('uses the private room API result as chat room id', async () => {
    const getOrCreatePrivateRoom = vi.fn().mockResolvedValue({
      code: 0,
      data: 9527,
    })

    const result = await createPrivateRoomNavigation(
      { id: 12, userName: 'UI设计师 - 小李' },
      { getOrCreatePrivateRoom }
    )

    expect(getOrCreatePrivateRoom).toHaveBeenCalledWith({ peerUserId: 12 })
    expect(result).toEqual({
      ok: true,
      url: '/pages/chat/index?id=9527&name=UI%E8%AE%BE%E8%AE%A1%E5%B8%88%20-%20%E5%B0%8F%E6%9D%8E',
    })
  })

  it('rejects friends without user id before calling the API', async () => {
    const getOrCreatePrivateRoom = vi.fn()

    const result = await createPrivateRoomNavigation(
      { userName: '未命名' },
      { getOrCreatePrivateRoom }
    )

    expect(getOrCreatePrivateRoom).not.toHaveBeenCalled()
    expect(result).toEqual({
      ok: false,
      message: '好友信息不完整',
    })
  })

  it('returns an error message when private room creation fails', async () => {
    const getOrCreatePrivateRoom = vi.fn().mockResolvedValue({
      code: 500,
      message: '无权创建私聊',
    })

    const result = await createPrivateRoomNavigation(
      { id: 12, userName: 'UI设计师 - 小李' },
      { getOrCreatePrivateRoom }
    )

    expect(result).toEqual({
      ok: false,
      message: '无权创建私聊',
    })
  })
})
