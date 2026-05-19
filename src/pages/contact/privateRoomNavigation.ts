type PrivateRoomApi = (body: ChatAPI.ChatPrivateRoomRequest) => Promise<ChatAPI.BaseResponseLong>

type PrivateRoomNavigationResult =
  | {
      ok: true
      url: string
    }
  | {
      ok: false
      message: string
    }

export async function createPrivateRoomNavigation(
  friend: Pick<ChatAPI.ChatFriendUserVO, 'id' | 'userName'>,
  deps: { getOrCreatePrivateRoom: PrivateRoomApi }
): Promise<PrivateRoomNavigationResult> {
  if (!friend.id) {
    return {
      ok: false,
      message: '好友信息不完整',
    }
  }

  const res = await deps.getOrCreatePrivateRoom({ peerUserId: friend.id })
  if (res.code === 0 && res.data) {
    return {
      ok: true,
      url: `/pages/chat/index?id=${res.data}&name=${encodeURIComponent(friend.userName || '')}`,
    }
  }

  return {
    ok: false,
    message: res.message || '打开聊天失败',
  }
}
