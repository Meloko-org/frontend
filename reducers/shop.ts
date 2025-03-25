import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ShopData,
  MarketsData,
  StockData,
  ClickCollectData,
} from "../types/API";

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
      console.log("shop reset", state);
    },
    setClickCollect: (
      state: ShopState,
      action: PayloadAction<ClickCollectData>,
    ): void => {
      if (state.value) {
        state.value.clickCollect = action.payload;
      }
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
    // permet d'ajouter des marketS en vérifiant leur non présence
    addMarket: (
      state: ShopState,
      action: PayloadAction<MarketsData[]>,
    ): void => {
      if (state.value) {
        const existingMarketIds = state.value.markets.map(
          (market: MarketsData) => market.market._id,
        );
        const newMarkets = action.payload.filter(
          (newMarket) => !existingMarketIds.includes(newMarket.market._id),
        );
        state.value.markets = [...state.value.markets, ...newMarkets];
      }
    },
    resetMarkets: (state: ShopState): void => {
      if (state.value) {
        state.value.markets = [];
      }
    },
  },
});

export const {
  setShopData,
  resetShopData,
  addProducts,
  addNote,
  addMarket,
  setClickCollect,
  resetMarkets,
} = shopSlice.actions;
export default shopSlice.reducer;
