import { atom, useSetRecoilState } from 'recoil';
import { PhxUser, SecurityRole, SecurityUserGroup, SecurityUserRole } from "../../../../types/PhxUser";
import { SecurityRoleResource } from "../../../../types/SecurityRole";

interface UserState {
    employeeMasterList: PhxUser[];
    groupsMasterList: SecurityUserGroup[];
    rolesMasterList: SecurityUserRole[];
    employee: PhxUser;
    acquiredGroups?: SecurityUserGroup[];
    acquiredRoles: SecurityRole[] | undefined;
    acquiredResources: SecurityRoleResource[] | undefined;
    selectedUser: PhxUser | null;
    copyUser: PhxUser | null;
    groupObj: any;
    roleObj: any;
    savePending?: boolean;
}

export const userState = atom({
    key: "user",
    default: {} as UserState
});

export const useUser = () => useSetRecoilState(userState);