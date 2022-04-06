import { atom, useSetRecoilState } from 'recoil';
import { PhxUser, SecurityGroup, SecurityRole, SecurityUserGroup, SecurityUserRole } from "../../../../types/PhxUser";
import { SecurityGroupRole } from '../../../../types/SecurityGroup';
import { SecurityRoleResource } from "../../../../types/SecurityRole";

interface UserState {
    employeeMasterList: PhxUser[];
    groupsMasterList: SecurityUserGroup[];
    rolesMasterList: SecurityUserRole[];
    employee: PhxUser;
    acquiredGroups: SecurityGroup[] | undefined;
    acquiredRoles: SecurityRole[] | undefined;
    acquiredResources: SecurityRoleResource[] | undefined;
    selectedUser: PhxUser | null;
    copyUser: PhxUser | null;
    groupObj: any;
    roleObj: any;
}

export const userState = atom({
    key: "user",
    default: {} as UserState
});

export const useUser = () => useSetRecoilState(userState);