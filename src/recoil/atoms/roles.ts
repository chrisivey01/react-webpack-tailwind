import { atom, useSetRecoilState } from "recoil";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";

interface RolesState {
    roleSelected: SecurityRole;
    filteredResourceList: SecurityResource[];
    rolesMasterList: SecurityRole[];
    resourcesMasterList: SecurityResource[];
    actionSelected: any;
}

export const rolesState = atom({
    key: "roles",
    default: {} as RolesState
});

export const useRoles = () => useSetRecoilState(rolesState);