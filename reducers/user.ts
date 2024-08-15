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
    bookmarks: [],
    orders: [],
    clerkPasswordEnabled: null,
    producer: null
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state: UserState, action: PayloadAction<UserData>): void => {
      console.log(state.value.clerkPasswordEnabled)
      state.value = action.payload
    },
    addOrder: (state: UserState, action: PayloadAction): void => {
      state.value.orders.push(action.payload)
    }
  }
})

export const { updateUser, addOrder } = userSlice.actions
export default userSlice.reducer