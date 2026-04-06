import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type TabType = 'message' | 'contact' | 'profile'

interface AppState {
  activeTab: TabType
}

const initialState: AppState = {
  activeTab: 'message'
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
