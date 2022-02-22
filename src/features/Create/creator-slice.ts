import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreatorState {
    securityFiltered: Security
}

const initialState: any = {
    securityFiltered: []
};

export const createsSlice = createSlice({
    name: "creator",
    initialState,
    reducers: {
    }
});

export const createsReducer = createsSlice.reducer;
export const {

} = createsSlice.actions;