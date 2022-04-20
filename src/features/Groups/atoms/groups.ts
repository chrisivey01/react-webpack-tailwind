import { atom, useSetRecoilState } from "recoil";
import { SecurityGroup, SecurityGroupList, SecurityGroupRole } from "../../../../types/SecurityGroup";
import { SecurityResource, SecurityRole, SecurityRoleResource } from "../../../../types/SecurityRole";

interface GroupsState {
    groupsRoleMasterList: SecurityGroupRole[];
    rolesSelected: SecurityRole[];
    rolesMasterList: SecurityRole[];
    groupsMasterList: SecurityGroup[];
    resourcesMasterList: SecurityResource[];
    securityRoleResourcesMasterList: SecurityRoleResource[];
    selectedGroup?: SecurityGroup;
    resourcesFilteredList: SecurityResource[];
    rolesFilteredList: SecurityRole[];
    groupSelected?: SecurityGroupList;
}

export const groupState = atom({
    key: "groups",
    default: {
        groupsRoleMasterList: [],
        rolesSelected: [],
        rolesMasterList: [],
        groupsMasterList: [],
        resourcesMasterList: [],
        securityRoleResourcesMasterList: [],
        resourcesFilteredList: [],
        rolesFilteredList: []
    } as GroupsState
});

export const useGroups = () => useSetRecoilState(groupState);