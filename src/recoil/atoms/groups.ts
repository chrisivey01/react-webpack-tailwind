import { atom, useSetRecoilState } from "recoil";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityGroupRole } from "../../../types/SecurityGroupRole";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";

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
}

export const groupState = atom({
    key: "groups",
    default: {} as GroupsState
});

export const useGroups = () => useSetRecoilState(groupState);