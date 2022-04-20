import { atom, useSetRecoilState } from "recoil";
import { SecurityResource, SecurityRole, SecurityRoleListSave } from "../../../../types/SecurityRole";

interface RolesState {
    roleSelected: SecurityRole;
    filteredResourceList: any;
    rolesMasterList: SecurityRole[];
    resourcesMasterList: SecurityResource[];
    actionSelected: any;
    roleSaved: SecurityRoleListSave;
    resourcesLeft: SecurityResource[];
    savePending: boolean;
}

export const rolesState = atom({
    key: "roles",
    default: {} as RolesState
});

export const useRoles = () => useSetRecoilState(rolesState);