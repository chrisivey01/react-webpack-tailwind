import { createSlice } from "@reduxjs/toolkit";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityResource } from './../../../types/SecurityResource';
import { SecurityRole } from './../../../types/SecurityRole';

interface CreatorState {
    rolesSelected: SecurityRole[];
    resourcesFiltered: SecurityResource[];
    actionSelected: string;
    groupGroupSelected?: SecurityGroup;
    rolesFiltered: SecurityRole[];
}

const initialState = {
    rolesSelected: [],
    resourcesFiltered: [],
    actionSelected: 'view',
    rolesFiltered: []
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
        },
        setRoleFiltered: (state, { payload }) => {
            state.rolesFiltered = payload;
        },
        addSingleRoleHandler: (state, { payload }) => {
            state.rolesFiltered = payload;
        }
    }
});

export const creatorReducer = createsSlice.reducer;
export const {
    rolesSelectedHandler,
    rolesSingleSelectHandler,
    actionSelectorCreate,
    setRoleFiltered,
    addSingleRoleHandler
} = createsSlice.actions;