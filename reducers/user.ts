import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../types/API";

export type UserState = {
  value: UserData
}

const initialState: UserState = {
  value: {
    email: null,
    firstname: null ,
    lastname: null,
    avatar: null,
    favSearch: [],
    bookmarks: []
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state: UserState, action: PayloadAction<UserData>): void => {
      console.log("payload", action.payload)
      state.value = action.payload
    }
  }
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer