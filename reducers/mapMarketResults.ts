import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type mapMarketResultsState = {
  selectedMarketId: string | null;
  isSearchActive: boolean;
};

const initialState: mapMarketResultsState = {
  selectedMarketId: null,
  isSearchActive: false,
};

export const mapMarketResultsSlice = createSlice({
  name: "mapMarketResults",
  initialState,
  reducers: {
    setSelectedMarketId: (state, action: PayloadAction<string | null>) => {
      state.selectedMarketId = action.payload;
    },
    setIsSearchActive: (state, action: PayloadAction<boolean>) => {
      state.isSearchActive = action.payload;
    },
  },
});

export const { setSelectedMarketId, setIsSearchActive } =
  mapMarketResultsSlice.actions;
export default mapMarketResultsSlice.reducer;
