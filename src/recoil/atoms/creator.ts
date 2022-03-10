import { atom, useSetRecoilState } from "recoil";
import { SecurityRoleList, SecurityRole, SecurityRoleResourceList, SecurityRoleResource, SecurityResourceList, SecurityResource } from "../../../types/SecurityRoleList";
import { Action } from "../../../types/ActionList";


interface CreatorState {
    rolesSelected: string[];
    resourcesFiltered: SecurityResource[];
    role?: {
        changeFlag?: string | undefined;
        name?: string | undefined;
        desc?: string | undefined;
        operationCd?: string | undefined;
        securityAppEaiNbr?: number;
        securityRoleResourceList?: SecurityRoleResource[]
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
    } as CreatorState
});

export const useCreator = () => useSetRecoilState(creatorState);