import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData, OrderData, UserAddressData } from "../types/API";

export type UserState = {
  value: UserData;
};

const initialState: UserState = {
  value: {
    _id: null,
    email: null,
    firstname: null,
    lastname: null,
    avatar: null,
    favSearch: [],
    bookmarks: [],
    orders: [],
    clerkPasswordEnabled: null,
    producer: null,
    addresses: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state: UserState, action: PayloadAction<UserData>): void => {
      state.value = action.payload;
    },
    updateUserAddresses: (
      state: UserState,
      action: PayloadAction<UserAddressData[]>,
    ): void => {
      state.value.addresses = action.payload;
    },
    setDefaultAddress: (
      state: UserState,
      action: PayloadAction<UserAddressData[]>,
    ): void => {
      state.value.addresses = action.payload;
    },
    addOrder: (state: UserState, action: PayloadAction<OrderData>): void => {
      state.value.orders.push(action.payload);
    },
    resetUser: (state: UserState): void => {
      state.value = {
        _id: null,
        email: null,
        firstname: null,
        lastname: null,
        avatar: null,
        favSearch: [],
        bookmarks: [],
        orders: [],
        clerkPasswordEnabled: null,
        producer: null,
        addresses: null,
      };

      console.log("user reset", state);
    },
  },
});

export const {
  updateUser,
  addOrder,
  resetUser,
  updateUserAddresses,
  setDefaultAddress,
} = userSlice.actions;
export default userSlice.reducer;
