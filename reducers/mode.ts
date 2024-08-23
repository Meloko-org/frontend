import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModeData = {
    mode: string
}

export type ModeState = {
    value: ModeData
}

const initialState: ModeState = {
    value: { mode: "light"}
}

export const modeSlice = createSlice({
    name: 'mode',
    initialState,
    reducers: {
        changeMode: (state: ModeState, action: PayloadAction<ModeData>): void => {
            state.value.mode = action.payload
        }
    }
})

export const { changeMode } = modeSlice.actions
export default modeSlice.reducer