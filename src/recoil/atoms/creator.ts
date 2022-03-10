import { atom, useSetRecoilState } from "recoil";
import { SecurityRoleList, SecurityRole, SecurityRoleResourceList, SecurityRoleResource, SecurityResourceList, SecurityResource, SecurityRoleListSave, SecurityRoleListSaveList } from "../../../types/SecurityRoleList";
import { Action } from "../../../types/ActionList";


interface CreatorState {
    rolesSelected: string[];
    resourcesFiltered: SecurityResource[];
    securityRoleList?: SecurityRoleListSaveList;
    show: boolean;
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
    groupGroupSelected?: SecurityGroup;
    rolesFiltered: SecurityRole[];
}

export const creatorState = atom({
    key: "creator",
    default: {
        rolesSelected: [],
        resourcesFiltered: [],
        actionList: [],
        rolesFiltered: [],
        show: false,
    } as CreatorState
});

export const useCreator = () => useSetRecoilState(creatorState);