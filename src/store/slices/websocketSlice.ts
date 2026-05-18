import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { WsMessage } from '@/services/websocket'

interface OnlineStatusData {
  userId: number
  online: boolean
}

interface WebSocketState {
  connected: boolean
  connecting: boolean
  lastMessage: WsMessage | null
  onlineUsers: Record<number, boolean>
}

const initialState: WebSocketState = {
  connected: false,
  connecting: false,
  lastMessage: null,
  onlineUsers: {},
}

export const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setWsConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
    },
    setWsConnecting: (state, action: PayloadAction<boolean>) => {
      state.connecting = action.payload
    },
    addWsMessage: (state, action: PayloadAction<WsMessage>) => {
      state.lastMessage = action.payload
    },
    setOnlineStatus: (state, action: PayloadAction<OnlineStatusData | OnlineStatusData[]>) => {
      const data = Array.isArray(action.payload) ? action.payload : [action.payload]
      data.forEach(({ userId, online }) => {
        state.onlineUsers[userId] = online
      })
    },
  },
})

export const { setWsConnected, setWsConnecting, addWsMessage, setOnlineStatus } = websocketSlice.actions

export default websocketSlice.reducer
