import { atom, useSetRecoilState } from "recoil";
import { Action } from "../../../../types/ActionList";
import { SecurityResource, SecurityRole, SecurityRoleListSaveList } from "../../../../types/SecurityRoleList";

interface CreateRoleState {
    rolesSelected: string[];
    resourcesFiltered: SecurityResource[];
    securityRoleList?: SecurityRoleListSaveList;
    show: boolean;
    createdPending: boolean;
    role?: {
        changeFlag?: string | undefined;
        roleName?: string | undefined;
        roleDesc?: string | undefined;
        operationCd?: string | undefined;
        securityAppEaiNbr?: number;
        securityRoleResourceList?: SecurityResource[];
    };
    actionList: Action[];
    actionSelected?: Action;
    rolesFiltered: SecurityRole[];
}

export const createRoleState = atom({
    key: "createRole",
    default: {
        rolesSelected: [],
        resourcesFiltered: [],
        actionList: [],
        rolesFiltered: [],
        show: false,
        createdPending: false,
    } as CreateRoleState
});

export const useCreateRole = () => useSetRecoilState(createRoleState);