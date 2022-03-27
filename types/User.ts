import { SecurityGroupResource, SecurityGroup } from './SecurityGroup';
import { SecurityRole } from "./SecurityRole";

type User = {
    companyNameCode: number,
    emailId: string,
    firstName: string,
    lastName: string,
    userId: string;
};

type UserList = {
    activeFlg: string,
    allowableUrsaNetworksCds: string,
    altEffDaysView: string,
    carrierGrpCd: string,
    ccRestrictedLeadDays: number,
    companyNameCode: number,
    defaultLegTypeCd: string,
    emailId: string,
    emplNbr: string,
    fdxCompanyGrp: number,
    firstName: string,
    guiUserPreferences: string,
    inactiveUserStatus: string,
    lastLoginDtTm: string,
    lastName: string,
    lastUpdDtTm: string,
    lastUpdUser: string,
    metric: string,
    oca: number,
    operationCd: string,
    orgCode: string,
    phxAccess: string,
    phxUserOid: number,
    resourceByPriorityList: SecurityGroupResource[],
    securityUserGroupList: [
        {
            changeFlag: string,
            lastUpdDtTm: string,
            lastUpdUser: string,
            operationCd: string,
            securityAppEaiNbr: number,
            securityGroup: SecurityGroup,
            securityUserGroupUuid: string;
        }
    ],
    securityUserRoleList: [
        {
            changeFlag: string,
            lastUpdDtTm: string,
            lastUpdUser: string,
            operationCd: string,
            securityAppEaiNbr: number,
            securityRole: SecurityRole,
            securityUserRoleUuid: string;
        }
    ],
    smtpHost: string,
    userId: string,
    userRouteTypeCd: string;
};


export type { User, UserList };
//   phxUserList: [
//     {
//       companyNameCode: number,
//       emailId: string,
//       firstName: string,
//       lastName: string,
//       userId: string
//     }
//   ],