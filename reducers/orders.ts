import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderData } from "../types/API";

export type OrdersState = {
  value: OrderData[];
};

const initialState: OrdersState = {
  value: [],
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (
      state: OrdersState,
      action: PayloadAction<OrderData[]>,
    ): void => {
      state.value = action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
