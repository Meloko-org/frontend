import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartData } from "../types/API";

export type CartState = {
  cart: CartData[] | []
}

const initialState: CartState = {
  cart: []
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state: CartState, action: PayloadAction<CartData>): void => {
      state.cart.push(action.payload)
    },
    increaseCartQuantity: (state: CartState, action: PayloadAction): void => {
      const product = state.cart.find(c => c.stockData._id === action.payload._id)
      product.quantity++
    },
    decreaseCartQuantity: (state: CartState, action: PayloadAction): void => {
      const product = state.cart.find(c => c.stockData._id === action.payload._id)
      product.quantity > 1 ? product.quantity-- : state.cart = state.cart.filter(c => c !== product)
    },
  }
})

export const { addProductToCart, increaseCartQuantity, decreaseCartQuantity } = cartSlice.actions
export default cartSlice.reducer