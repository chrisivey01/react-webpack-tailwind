import { atom, useSetRecoilState } from "recoil";
import { Action } from "../../../../types/ActionList";
import { SecurityGroup, SecurityGroupList, SecurityGroupRole } from "../../../../types/SecurityGroup";
import { SecurityResource, SecurityRole, SecurityRoleListSaveList, SecurityRoleResource } from "../../../../types/SecurityRole";


type Group = {
    groupName: string | undefined;
    securityAppEaiNbr: number | undefined;
    operationCd?: string;
};

interface CreateGroupState {
    selectedRoles: SecurityGroupRole[];
    selectedGroups: SecurityGroup[];
    selectedGroupStrings: SecurityGroup[];
    show: boolean;
    createdPending: boolean;
    newGroup?: SecurityGroupList;
    group: Group;
}

export const createGroupState = atom({
    key: "createGroup",
    default: {
        selectedGroupStrings: [],
        selectedRoles: [],
        selectedGroups: [],
        show: false,
        createdPending: false,
        group: {
            groupName: undefined,
            securityAppEaiNbr: undefined
        }
    } as CreateGroupState
});

export const useCreateGroup = () => useSetRecoilState(createGroupState);