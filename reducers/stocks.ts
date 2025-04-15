import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductsTypesByCategory } from "../types/API";

export type StocksState = {
  value: ProductsTypesByCategory[];
};

const initialState: StocksState = {
  value: [],
};

export const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setProductsTypes: (
      state: StocksState,
      action: PayloadAction<ProductsTypesByCategory[]>,
    ): void => {
      state.value = action.payload;
    },
  },
});

export const { setProductsTypes } = stocksSlice.actions;
export default stocksSlice.reducer;
