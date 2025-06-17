import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type mapShopResultsState = {
  selectedShopId: string | null;
};

const initialState: mapShopResultsState = {
  selectedShopId: null,
};

export const mapShopResultsSlice = createSlice({
  name: "mapShopResults",
  initialState,
  reducers: {
    setSelectedShopId: (state, action: PayloadAction<string | null>) => {
      state.selectedShopId = action.payload;
    },
  },
});

export const { setSelectedShopId } = mapShopResultsSlice.actions;
export default mapShopResultsSlice.reducer;
