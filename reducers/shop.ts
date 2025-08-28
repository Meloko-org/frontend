import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ShopData,
  MarketsData,
  StockData,
  ClickCollectData,
  ShopFeaturesData,
  NoteData,
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
    setTypes: (state: ShopState, action: PayloadAction<string[]>): void => {
      if (state.value) {
        state.value.type = action.payload;
      }
    },
    setFeatures: (
      state: ShopState,
      action: PayloadAction<ShopFeaturesData[]>,
    ): void => {
      if (state.value) {
        state.value.features = action.payload;
      }
    },
    setProducts: (
      state: ShopState,
      action: PayloadAction<StockData[]>,
    ): void => {
      if (state.value) {
        state.value.products = action.payload;
      }
    },
    addProducts: (
      // à supprimer
      state: ShopState,
      action: PayloadAction<StockData[]>,
    ): void => {
      if (state.value) {
        const existingStockIds = state.value.products!.map(
          (stock: StockData) => stock._id,
        );
        const newStocks = action.payload.filter(
          (newStock) => !existingStockIds.includes(newStock._id),
        );
        state.value.products = [...(state.value.products ?? []), ...newStocks];
      }
    },
    updateProduct: (
      // à supprimer
      state: ShopState,
      action: PayloadAction<StockData>,
    ): void => {
      if (state.value?.products) {
        const index = state.value.products.findIndex(
          (p) => p._id === action.payload._id,
        );

        if (index !== -1) {
          state.value.products[index] = action.payload;
        } else {
          state.value.products.push(action.payload);
        }
      }
    },
    resetProducts: (state: ShopState): void => {
      if (state.value) {
        state.value.products = [];
      }
    },
    addNote: (state: ShopState, action: PayloadAction<NoteData>): void => {
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
  setTypes,
  setFeatures,
  setProducts,
  addProducts,
  updateProduct,
  resetProducts,
  addNote,
  addMarket,
  setClickCollect,
  resetMarkets,
} = shopSlice.actions;
export default shopSlice.reducer;
