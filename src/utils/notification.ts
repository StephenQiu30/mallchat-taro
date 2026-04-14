import Taro from '@tarojs/taro'
import { getNotificationUnreadCount } from '@/api/notification/notificationController'
import { getToken } from '@/utils/auth'

export async function refreshNotificationBadge() {
  if (!getToken()) {
    try {
      await Taro.removeTabBarBadge({ index: 2 })
    } catch (_) {}
    return 0
  }

  try {
    const res = await getNotificationUnreadCount()
    const count = Number(res.data || 0)

    if (count > 0) {
      await Taro.setTabBarBadge({
        index: 2,
        text: count > 99 ? '99+' : String(count),
      })
      return count
    }

    await Taro.removeTabBarBadge({ index: 2 })
    return 0
  } catch (error) {
    try {
      await Taro.removeTabBarBadge({ index: 2 })
    } catch (_) {}
    return 0
  }
}
