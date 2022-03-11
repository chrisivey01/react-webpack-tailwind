import { atom, useSetRecoilState } from "recoil";
import { SecurityRoleList, SecurityRole, SecurityRoleResourceList, SecurityRoleResource, SecurityResourceList, SecurityResource, SecurityRoleListSave, SecurityRoleListSaveList } from "../../../types/SecurityRoleList";
import { Action } from "../../../types/ActionList";


interface CreatorState {
    rolesSelected: string[];
    resourcesFiltered: SecurityResource[];
    securityRoleList?: SecurityRoleListSaveList;
    show: boolean;
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