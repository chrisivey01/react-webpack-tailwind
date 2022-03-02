import { SecurityGroupRole } from './../../../types/SecurityGroupRole';
import { SecurityUserGroup } from './../../../types/SecurityUserGroup';
import { SecurityRole } from './../../../types/SecurityRole';
import { PhxUser } from "../../../types/PhxUser";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityResource } from '../../../types/SecurityResource';
import { atom, useSetRecoilState } from 'recoil';
import { SecurityUserRole } from '../../../types/SecurityUserRole';
import { SecurityAction } from '../../../types/SecurityAction';
import { SecurityRoleResource } from '../../../types/SecurityRoleResource';

interface UsersState {
    employeeMasterList: PhxUser[];
    securityUserGroupMasterList: SecurityUserGroup[];
    securityGroupRoleMasterList: SecurityGroupRole[];
    securityGroupMasterList: SecurityGroup[];
    rolesMasterList: SecurityRole[];
    resourcesMasterList: SecurityResource[];
    securityUserRoleMasterList: SecurityUserRole[];
    securityActionMasterList: SecurityAction[];
    employee: PhxUser;
    groups: SecurityGroup[];
    roles: SecurityRole[];
    resources: SecurityResource[];
    securityRoleResourceMasterList: SecurityRoleResource[];
}

export const userState = atom({
    key: "user",
    default: {} as UsersState
});

export const useUser = () => useSetRecoilState(userState);