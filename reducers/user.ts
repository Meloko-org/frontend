import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserState = {
  value: {
    email: string | null
    firstname: string | null 
    lastname: string | null
    avatar: string | null
    favSearch: string[] | null
    bookmarks: string[] | null
  },
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
    updateUser: (state : UserState, action : PayloadAction<UserState>) => {
      state.value.email = action.payload.email
      state.value.firstname = action.payload.firstname
      state.value.lastname = action.payload.lastname
      state.value.avatar = action.payload.avatar
      state.value.bookmarks = action.payload.bookmarks
      state.value.favSearch = action.payload.favSearch
    }
  }
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer