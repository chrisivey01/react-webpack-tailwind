import { atom, useSetRecoilState } from "recoil";
import { Action } from "../../../../types/ActionList";
import { SecurityResource, SecurityRole, SecurityRoleListSaveList, SecurityRoleResource } from "../../../../types/SecurityRole";

interface CreateRoleState {
    rolesSelected: any[];
    resourcesFiltered: SecurityResource[];
    securityRoleList?: SecurityRole[];
    show: boolean;
    createdPending: boolean;
    role?: {
        changeFlag?: string;
        roleName?: string;
        roleDesc?: string;
        operationCd?: string;
        securityAppEaiNbr?: number;
        securityRoleResourceList?: SecurityResource[];
    };
    actionList: Action[];
    actionSelected?: Action;
    rolesFiltered: SecurityRole[];
    securityRoleResourceList: SecurityRoleResource[];
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
        securityRoleResourceList: []
    } as CreateRoleState
});

export const useCreateRole = () => useSetRecoilState(createRoleState);