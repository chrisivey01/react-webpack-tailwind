import { atom, useSetRecoilState } from 'recoil';
import { PhxUser, SecurityUserGroup, SecurityUserRole } from "../../../../types/PhxUser";
import { SecurityRoleResource } from "../../../../types/SecurityRole";

interface UserState {
    employeeMasterList: PhxUser[];
    groupsMasterList: SecurityUserGroup[];
    rolesMasterList: SecurityUserRole[];
    employee: PhxUser;
    acquiredGroups: SecurityUserGroup[];
    acquiredRoles: SecurityUserRole[];
    acquiredResources: SecurityRoleResource[];
    selectedUser: PhxUser;
    copySelectedUser: PhxUser;
}

export const userState = atom({
    key: "user",
    default: {} as UserState
});

export const useUser = () => useSetRecoilState(userState);