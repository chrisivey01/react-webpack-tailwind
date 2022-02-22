import { SecurityResource } from './../../../types/SecurityResource';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SecurityRole } from "../../../types/SecurityRole";

interface RolesState {
    roleSelected: SecurityRole;
    filteredResourceList: SecurityResource[];
}

const initialState: any = {
    roleSelected: {},
    filteredResourceList: [],
    rolesMasterList: []
};

export const rolesSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        setSelectedRole: (state, { payload }) => {
            state.roleSelected = payload;
        },
        setFilteredResourceList: (state, { payload }) => {
            state.filteredResourceList = payload;
        },
        setRolesMasterList: (state, { payload }) => {
            state.rolesMasterList = payload;
        },
        addNewResourceToList: (state, { payload }) => {
            state.filteredResourceList = payload;
        },
        updateResourceAction: (state, { payload }) => {
            state.filteredResourceList = payload;
        }
    }
});

export const rolesReducer = rolesSlice.reducer;
export const {
    setSelectedRole,
    setFilteredResourceList,
    setRolesMasterList,
    addNewResourceToList,
    updateResourceAction
} = rolesSlice.actions;