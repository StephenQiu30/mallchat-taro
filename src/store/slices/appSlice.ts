import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type TabType = 'message' | 'contact' | 'profile' | 'chat' | 'none'

interface AppState {
  activeTab: TabType
}

const initialState: AppState = {
  activeTab: 'message' // Default to message index
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TabType>) => {
      state.activeTab = action.payload
    }
  }
})

export const { setActiveTab } = appSlice.actions

export default appSlice.reducer
