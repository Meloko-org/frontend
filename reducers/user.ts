import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../types/API";

export type UserState = {
  user: UserData
}

const initialState: UserState = {
  user: {
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
      state.user.email = action.payload.email
      state.user.firstname = action.payload.firstname
      state.user.lastname = action.payload.lastname
      state.user.avatar = action.payload.avatar
      state.user.bookmarks = action.payload.bookmarks
      state.user.favSearch = action.payload.favSearch
    }
  }
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer