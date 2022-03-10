import { atom, useSetRecoilState } from "recoil";
import { SecurityRoleList, SecurityRole, SecurityRoleResourceList, SecurityRoleResource, SecurityResourceList, SecurityResource, SecurityRoleListSave } from "../../../../types/SecurityRoleList";

interface RolesState {
    roleSelected: SecurityRole;
    filteredResourceList: any;
    rolesMasterList: SecurityRole[];
    resourcesMasterList: SecurityResource[];
    actionSelected: any;
    roleSaved: SecurityRoleListSave;
    resourcesLeft: SecurityResource[];
}

export const rolesState = atom({
    key: "roles",
    default: {} as RolesState
});

export const useRoles = () => useSetRecoilState(rolesState);