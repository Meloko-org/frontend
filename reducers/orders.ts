import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderSummary } from "../types/API";

export type OrdersState = {
  value: OrderSummary[];
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
      action: PayloadAction<OrderSummary[]>,
    ): void => {
      state.value = action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
