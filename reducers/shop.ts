import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShopData, MarketData, StockData } from "../types/API";

export type ShopState = {
  value: ShopData;
};

const initialState: ShopState = {
  value: null,
};

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setShopData: (state: ShopState, action: PayloadAction<ShopData>): void => {
      state.value = action.payload;
    },
    resetShopData: (state: ShopState): void => {
      state.value = null;
    },
    addProducts: (state: ShopState, action: PayloadAction<StockData>): void => {
      if (state.value && state.value.products) {
        state.value.products.push(action.payload);
      } else if (state.value) {
        state.value.products = [action.payload];
      }
    },
    addNote: (
      state: ShopState,
      action: PayloadAction<{
        note: { $numberDecimal: string } | number | any;
      }>,
    ): void => {
      if (state.value) {
        state.value.notes.push(action.payload);
      }
    },
    addMarket: (state: ShopState, action: PayloadAction<MarketData>): void => {
      if (state.value) {
        state.value.markets = [action.payload];
      }
    },
  },
});

export const { setShopData, resetShopData, addProducts, addNote, addMarket } =
  shopSlice.actions;
export default shopSlice.reducer;
