import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type mapShopResultsState = {
  selectedShopId: string | null;
  isSearchActive: boolean;
};

const initialState: mapShopResultsState = {
  selectedShopId: null,
  isSearchActive: false,
};

export const mapShopResultsSlice = createSlice({
  name: "mapShopResults",
  initialState,
  reducers: {
    setSelectedShopId: (state, action: PayloadAction<string | null>) => {
      state.selectedShopId = action.payload;
    },
    setIsSearchActive: (state, action: PayloadAction<boolean>) => {
      state.isSearchActive = action.payload;
    },
  },
});

export const { setSelectedShopId, setIsSearchActive } =
  mapShopResultsSlice.actions;
export default mapShopResultsSlice.reducer;
