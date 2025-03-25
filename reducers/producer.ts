import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProducerData, UserData } from "../types/API";

export type ProducerState = {
  value: ProducerData;
};

const initialState: ProducerState = {
  value: null,
};

export const producerSlice = createSlice({
  name: "producer",
  initialState,
  reducers: {
    setProducerData: (
      state: ProducerState,
      action: PayloadAction<ProducerData>,
    ): void => {
      state.value = action.payload;
    },
    resetProducerData: (state: ProducerState): void => {
      state.value = null;
      console.log("producer reset", state);
    },
  },
});

export const { setProducerData, resetProducerData } = producerSlice.actions;
export default producerSlice.reducer;
