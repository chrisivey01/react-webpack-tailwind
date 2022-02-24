import { SecurityResource } from './../../../types/SecurityResource';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SecurityRole } from "../../../types/SecurityRole";

interface RolesState {
    rolesSelected: SecurityRole[];
    filteredResourceList: SecurityResource[];
    rolesMasterList: SecurityRole[];
    resourcesMasterList: SecurityResource[];
}

const initialState = {
    rolesSelected: [],
    filteredResourceList: [],
    rolesMasterList: [],
    resourcesMasterList: []
} as RolesState;

export const rolesSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        setSelectedRole: (state, { payload }) => {
            state.rolesSelected = payload;
        },
        setFilteredResourceList: (state, { payload }) => {
            state.filteredResourceList = payload;
        },
        setRolesMasterList: (state, { payload }) => {
            state.rolesMasterList = payload;
        },
        setResourcesMasterList: (state, { payload }) => {
            state.resourcesMasterList = payload;
        },
        addNewResourceToList: (state, { payload }) => {
            state.filteredResourceList = payload;
        },
        updateResourceAction: (state, { payload }) => {
            state.filteredResourceList = payload
        }
    }
});

export const rolesReducer = rolesSlice.reducer;
export const {
    setSelectedRole,
    setFilteredResourceList,
    setResourcesMasterList,
    setRolesMasterList,
    addNewResourceToList,
    updateResourceAction
} = rolesSlice.actions;