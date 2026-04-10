import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getToken, getUserInfo } from '@/utils/auth'

interface UserState {
  userInfo: UserAPI.LoginUserVO | null
  token: string | null
  isLoggedIn: boolean
}

const initialState: UserState = {
  userInfo: getUserInfo() || null,
  token: getToken() || null,
  isLoggedIn: !!getToken(),
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfoAction: (state, action: PayloadAction<UserAPI.LoginUserVO>) => {
      state.userInfo = action.payload
      state.isLoggedIn = true
    },
    setTokenAction: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isLoggedIn = !!action.payload
    },
    logoutAction: (state) => {
      state.userInfo = null
      state.token = null
      state.isLoggedIn = false
    },
  },
})

export const { setUserInfoAction, setTokenAction, logoutAction } = userSlice.actions

export default userSlice.reducer
