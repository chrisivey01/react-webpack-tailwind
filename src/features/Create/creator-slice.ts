import { createSlice } from "@reduxjs/toolkit";
import { SecurityResource } from './../../../types/SecurityResource';
import { SecurityRole } from './../../../types/SecurityRole';

interface CreatorState {
    rolesSelected: SecurityRole[];
    resourcesFiltered: SecurityResource[];
    actionSelected: string;
}

const initialState: any = {
    rolesSelected: [],
    resourcesFiltered: [],
    actionSelected: 'view'
} as CreatorState;

export const createsSlice = createSlice({
    name: "creator",
    initialState,
    reducers: {
        rolesSelectedHandler: (state, { payload }) => {
            state.resourcesFiltered = [...state.resourcesFiltered, ...payload];
        },
        rolesSingleSelectHandler: (state, { payload }) => {
            state.resourcesFiltered = payload;
        },
        actionSelectorCreate: (state, { payload }) => {
            state.actionSelected = payload;
        }
    }
});

export const creatorReducer = createsSlice.reducer;
export const {
    rolesSelectedHandler,
    rolesSingleSelectHandler,
    actionSelectorCreate
} = createsSlice.actions;