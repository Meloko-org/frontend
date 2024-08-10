import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData, CartData } from "../types/API";

export type UserState = {
  data: UserData,
  cart: CartData[] | []
}

const initialState: UserState = {
  data: {
    email: null,
    firstname: null ,
    lastname: null,
    avatar: null,
    favSearch: [],
    bookmarks: []
  },
  cart: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state: UserState, action: PayloadAction<UserData>): void => {
      state.data.email = action.payload.email
      state.data.firstname = action.payload.firstname
      state.data.lastname = action.payload.lastname
      state.data.avatar = action.payload.avatar
      state.data.bookmarks = action.payload.bookmarks
      state.data.favSearch = action.payload.favSearch
    },
    addProductToCart: (state: UserState, action: PayloadAction<CartData>): void => {
      state.cart.push(action.payload)
    },
    increaseCartQuantity: (state: UserState, action: PayloadAction): void => {
      const product = state.cart.find(c => c.stockData._id === action.payload._id)
      product.quantity++
    },
    decreaseCartQuantity: (state: UserState, action: PayloadAction): void => {
      const product = state.cart.find(c => c.stockData._id === action.payload._id)
      product.quantity > 1 ? product.quantity-- : state.cart = state.cart.filter(c => c !== product)
    },
  }
})

export const { updateUser, addProductToCart, increaseCartQuantity, decreaseCartQuantity } = userSlice.actions
export default userSlice.reducer