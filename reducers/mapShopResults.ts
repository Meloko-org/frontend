import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShopResultData } from "../types/API";

export type mapShopResultsState = {
  selectedShopId: string | null;
  isShopSearchActive: boolean;
  isNavigating: boolean;
  resultsList: ShopResultData[];
};

const initialState: mapShopResultsState = {
  selectedShopId: null,
  isShopSearchActive: false,
  isNavigating: false,
  resultsList: [],
};

export const mapShopResultsSlice = createSlice({
  name: "mapShopResults",
  initialState,
  reducers: {
    setSelectedShopId: (state, action: PayloadAction<string | null>) => {
      state.selectedShopId = action.payload;
    },
    setIsShopSearchActive: (state, action: PayloadAction<boolean>) => {
      state.isShopSearchActive = action.payload;
    },
    setIsShopNavigating: (state, action: PayloadAction<boolean>) => {
      state.isNavigating = action.payload;
    },
    setShopResultsList: (state, action: PayloadAction<ShopResultData[]>) => {
      state.resultsList = action.payload;
    },
    clearShopResultsList: (state) => {
      state.resultsList = [];
    },
  },
});

export const {
  setSelectedShopId,
  setIsShopSearchActive,
  setIsShopNavigating,
  setShopResultsList,
  clearShopResultsList,
} = mapShopResultsSlice.actions;

export default mapShopResultsSlice.reducer;
