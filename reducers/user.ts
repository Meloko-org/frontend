import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData, OrderData } from "../types/API";

export type UserState = {
  value: UserData;
};

const initialState: UserState = {
  value: {
    email: null,
    firstname: null,
    lastname: null,
    avatar: null,
    favSearch: [],
    bookmarks: [],
    orders: [],
    clerkPasswordEnabled: null,
    producer: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state: UserState, action: PayloadAction<UserData>): void => {
      state.value = action.payload;
    },
    addOrder: (state: UserState, action: PayloadAction<OrderData>): void => {
      state.value.orders.push(action.payload);
    },
    resetUser: (state: UserState): void => {
      state.value = {
        email: null,
        firstname: null,
        lastname: null,
        avatar: null,
        favSearch: [],
        bookmarks: [],
        orders: [],
        clerkPasswordEnabled: null,
        producer: null,
      };

      console.log("user reset", state);
    },
  },
});

export const { updateUser, addOrder, resetUser } = userSlice.actions;
export default userSlice.reducer;
