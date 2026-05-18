import Taro from '@tarojs/taro'
import { store } from '@/store'
import { setWsConnected, setWsConnecting, addWsMessage, setOnlineStatus } from '@/store/slices/websocketSlice'

const WS_URL = process.env.TARO_APP_WS_URL || 'ws://localhost:9090'
const HEARTBEAT_INTERVAL = 30000
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000]

export enum WsMessageType {
  AUTH = 0,
  HEARTBEAT = 1,
  MESSAGE = 2,
  SYSTEM_NOTICE = 3,
  ONLINE_STATUS = 8,
  FRIEND_APPROVE = 10,
  ERROR = 99,
}

export interface WsMessage {
  type: WsMessageType
  data: any
}

type MessageHandler = (msg: WsMessage) => void

class WebSocketManager {
  private socketTask: Taro.SocketTask | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private reconnectAttempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private isManualClose = false
  private handlers: Map<WsMessageType, Set<MessageHandler>> = new Map()

  connect() {
    const token = Taro.getStorageSync('token')
    if (!token) {
      console.log('[WS] No token, skip connect')
      return
    }

    if (this.socketTask) {
      console.log('[WS] Already connected')
      return
    }

    this.isManualClose = false
    store.dispatch(setWsConnecting(true))

    console.log('[WS] Connecting to', WS_URL)

    const socketTask = Taro.connectSocket({
      url: WS_URL,
      header: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Taro.connectSocket may return Promise or SocketTask depending on platform
    if (socketTask && typeof (socketTask as any).then === 'function') {
      ;(socketTask as Promise<Taro.SocketTask>).then((task) => {
        this.setupSocket(task)
      }).catch((err) => {
        console.error('[WS] Connect failed', err)
        store.dispatch(setWsConnecting(false))
      })
    } else if (socketTask) {
      this.setupSocket(socketTask as unknown as Taro.SocketTask)
    }
  }

  private setupSocket(task: Taro.SocketTask) {
    this.socketTask = task

    task.onOpen(() => {
      console.log('[WS] Connected')
      store.dispatch(setWsConnected(true))
      store.dispatch(setWsConnecting(false))
      this.reconnectAttempt = 0
      this.startHeartbeat()
      this.sendAuth()
    })

    task.onMessage((res) => {
      try {
        const msg: WsMessage = JSON.parse(res.data as string)
        this.handleMessage(msg)
      } catch (e) {
        console.error('[WS] Parse error', e)
      }
    })

    task.onClose(() => {
      console.log('[WS] Disconnected')
      store.dispatch(setWsConnected(false))
      store.dispatch(setWsConnecting(false))
      this.clearTimers()
      this.socketTask = null
      if (!this.isManualClose) {
        this.scheduleReconnect()
      }
    })

    task.onError((err) => {
      console.error('[WS] Error', err)
      store.dispatch(setWsConnecting(false))
    })
  }

  disconnect() {
    this.isManualClose = true
    this.clearTimers()
    if (this.socketTask) {
      this.socketTask.close({})
      this.socketTask = null
    }
    store.dispatch(setWsConnected(false))
    store.dispatch(setWsConnecting(false))
  }

  send(data: any) {
    if (!this.socketTask) {
      console.warn('[WS] Not connected, cannot send')
      return false
    }
    this.socketTask.send({
      data: JSON.stringify(data),
    })
    return true
  }

  on(type: WsMessageType, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler)
    return () => this.off(type, handler)
  }

  off(type: WsMessageType, handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler)
  }

  private sendAuth() {
    const token = Taro.getStorageSync('token')
    this.send({
      type: WsMessageType.AUTH,
      data: { token },
    })
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: WsMessageType.HEARTBEAT, data: {} })
    }, HEARTBEAT_INTERVAL)
  }

  private scheduleReconnect() {
    const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS.length - 1)]
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempt + 1})`)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempt++
      this.connect()
    }, delay)
  }

  private clearTimers() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private handleMessage(msg: WsMessage) {
    store.dispatch(addWsMessage(msg))

    switch (msg.type) {
      case WsMessageType.ONLINE_STATUS:
        store.dispatch(setOnlineStatus(msg.data))
        break
      case WsMessageType.ERROR:
        console.error('[WS] Server error:', msg.data)
        break
    }

    const handlers = this.handlers.get(msg.type)
    if (handlers) {
      handlers.forEach((handler) => handler(msg))
    }
  }
}

export const wsManager = new WebSocketManager()
