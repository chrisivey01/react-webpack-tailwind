import { atom, useSetRecoilState } from "recoil";
import { SecurityRoleList, SecurityRole, SecurityRoleResourceList, SecurityRoleResource, SecurityResourceList, SecurityResource } from "../../../types/SecurityRoleList";

interface RolesState {
    roleSelected: SecurityRole;
    filteredResourceList: any;
    rolesMasterList: SecurityRole[];
    resourcesMasterList: SecurityResource[];
    actionSelected: any;
}

export const rolesState = atom({
    key: "roles",
    default: {} as RolesState
});

export const useRoles = () => useSetRecoilState(rolesState);