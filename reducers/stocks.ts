import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ProductsTypesByCategory,
  ShopCategoriesWithFamiliesData,
} from "../types/API";

export type StocksState = {
  value: ProductsTypesByCategory[];
  shopCategoriesWithFamilies?: ShopCategoriesWithFamiliesData[];
};

const initialState: StocksState = {
  value: [],
  shopCategoriesWithFamilies: undefined,
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
    setShopCategoriesWithFamilies: (
      state: StocksState,
      action: PayloadAction<ShopCategoriesWithFamiliesData[] | undefined>,
    ): void => {
      state.shopCategoriesWithFamilies = action.payload;
    },
  },
});

export const { setProductsTypes, setShopCategoriesWithFamilies } =
  stocksSlice.actions;
export default stocksSlice.reducer;
