import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartData } from "../types/API";

export type CartState = {
  value: CartData[] | []
}

const initialState: CartState = {
  value: []
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state: CartState, action: PayloadAction) => {
      const shop = state.value.find(c => c.shop._id === action.payload.shop._id)
      if(shop) {
        shop.products.push({
          stockData: action.payload.stockData,
          quantity: 1
        })
      } else {
        state.value.push({
          shop: action.payload.shop,
          products: [{
            stockData: action.payload.stockData,
            quantity: 1
          }],
          withdrawMode: null
        })
      }


      console.log(`Product added, cart is now`, state.value)
    },
    increaseCartQuantity: (state: CartState, action: PayloadAction) => {
      const shop = state.value.find(c => c.shop._id === action.payload.shopId)
      const product = shop.products.find(p => p.stockData._id === action.payload.stockId)
      product.quantity++
    },
    decreaseCartQuantity: (state: CartState, action: PayloadAction) => {
      const shop = state.value.find(c => c.shop._id === action.payload.shopId)
      const product = shop.products.find(p => p.stockData._id === action.payload.stockId)
      product.quantity > 1 ? product.quantity-- : shop.products = shop.products.filter(p => p.stockData._id !== action.payload.stockId)
    },
    updateWithdrawMode: (state: CartState, action: PayloadAction) => {
      const shop = state.value.find(c => c.shop._id === action.payload.shopId)
      shop.withdrawMode = action.payload.withdrawMode
      if(action.payload.market) shop.market = action.payload.market
    },
  }
})

export const { addProductToCart, increaseCartQuantity, decreaseCartQuantity, updateWithdrawMode } = cartSlice.actions
export default cartSlice.reducer