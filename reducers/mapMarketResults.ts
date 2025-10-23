import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarketResultData } from "../types/API";

export type mapMarketResultsState = {
  selectedMarketId: string | null;
  isMarketSearchActive: boolean;
  isNavigating: boolean;
  resultsList: MarketResultData[];
};

const initialState: mapMarketResultsState = {
  selectedMarketId: null,
  isMarketSearchActive: false,
  isNavigating: false,
  resultsList: [],
};

export const mapMarketResultsSlice = createSlice({
  name: "mapMarketResults",
  initialState,
  reducers: {
    setSelectedMarketId: (state, action: PayloadAction<string | null>) => {
      state.selectedMarketId = action.payload;
    },
    setIsMarketSearchActive: (state, action: PayloadAction<boolean>) => {
      state.isMarketSearchActive = action.payload;
    },
    setIsMarketNavigating: (state, action: PayloadAction<boolean>) => {
      state.isNavigating = action.payload;
    },
    setMarketResultsList: (
      state,
      action: PayloadAction<MarketResultData[]>,
    ) => {
      state.resultsList = action.payload;
    },
    clearMarketResultsList: (state) => {
      state.resultsList = [];
    },
  },
});

export const {
  setSelectedMarketId,
  setIsMarketSearchActive,
  setIsMarketNavigating,
  setMarketResultsList,
  clearMarketResultsList,
} = mapMarketResultsSlice.actions;

export default mapMarketResultsSlice.reducer;
