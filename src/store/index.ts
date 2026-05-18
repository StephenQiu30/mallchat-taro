import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'
import userReducer from './slices/userSlice'
import websocketReducer from './slices/websocketSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    websocket: websocketReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
