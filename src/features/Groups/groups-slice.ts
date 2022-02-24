import { SecurityRoleResource } from './../../../types/SecurityRoleResource';
import { createSlice } from "@reduxjs/toolkit";
import { SecurityGroup } from '../../../types/SecurityGroup';
import { SecurityGroupRole } from "../../../types/SecurityGroupRole";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";

interface GroupsState {
    groupsRoleMasterList: SecurityGroupRole[];
    rolesSelected: SecurityRole[];
    rolesMasterList: SecurityRole[];
    groupsMasterList: SecurityGroup[];
    resourcesMasterList: SecurityResource[];
    securityRoleResourcesMasterList: SecurityRoleResource[];
    resourcesFilteredList: [];
    selectedGroup?: SecurityGroup;
    rolesFilteredList: SecurityRole[];
}

const initialState = {
    rolesSelected: [],
    groupsRoleMasterList: [],
    groupsMasterList: [],
    rolesMasterList: [],
    resourcesMasterList: [],
    securityRoleResourcesMasterList: [],
    resourcesFilteredList: [],
    rolesFilteredList: []
} as GroupsState;

export const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        setGroupsRoleMasterList: (state, { payload }) => {
            state.groupsRoleMasterList = payload;
        },
        setGroupsMasterList: (state, { payload }) => {
            state.groupsMasterList = payload;
        },
        setRolesMasterList: (state, { payload }) => {
            state.rolesMasterList = payload;
        },
        setResourcesMasterList: (state, { payload }) => {
            state.resourcesMasterList = payload;
        },
        setSecurityRoleResourcesMasterList: (state, { payload }) => {
            state.securityRoleResourcesMasterList = payload;
        },
        selectedGroupHandler: (state, { payload }) => {
            state.selectedGroup = payload;
        },
        setFilteredResourceList: (state, { payload }) => {
            state.resourcesFilteredList = payload;
        },
        setFilteredRolesList: (state, { payload }) => {
            state.rolesFilteredList = payload;
        }
    }
});

export const groupsReducer = groupsSlice.reducer;
export const {
    setGroupsRoleMasterList,
    setGroupsMasterList,
    setRolesMasterList,
    setResourcesMasterList,
    setSecurityRoleResourcesMasterList,
    selectedGroupHandler,
    setFilteredResourceList,
    setFilteredRolesList
} = groupsSlice.actions;