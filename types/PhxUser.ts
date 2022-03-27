import { SecurityActionType } from "./ActionList";
import { SecurityAction } from "./SecurityAction";
import { SecurityGroupRole } from "./SecurityGroup";
import { SecurityResource, SecurityRoleResource } from "./SecurityRole";

type PhxUser = {
    activeFlg?: string,
    allowableUrsaNetworksCds?: string,
    altEffDaysView?: string,
    carrierGrpCd?: string,
    ccRestrictedLeadDays?: number,
    companyNameCode?: number,
    defaultLegTypeCd?: string,
    emailId?: string,
    emplNbr?: string,
    fdxCompanyGrp?: number,
    firstName?: string,
    guiUserPreferences?: string,
    inactiveUserStatus?: string,
    lastLoginDtTm?: string,
    lastName?: string,
    lastUpdDtTm?: string,
    lastUpdUser?: string,
    metric?: string,
    oca?: number,
    operationCd?: string,
    orgCode?: string,
    phxAccess?: string,
    phxUserOid?: number,
    resourceByPriorityList?: SecurityRoleResource[],
    securityUserGroupList?: SecurityUserGroup[],
    securityUserRoleList?: SecurityUserRole[],
    smtpHost?: string,
    userId?: string,
    userRouteTypeCd?: string;
};

type SecurityUserGroup = {
    changeFlag: string;
    lastUpdDtTm: string;
    lastUpdUser: string;
    operationCd: string;
    phxUser: PhxUser;
    securityAppEaiNbr: number;
    securityGroup: SecurityGroup;
    securityUserGroupUuid: string;
};

type SecurityGroup = {
    changeFlag: string;
    groupName: string;
    lastUpdDtTm: string;
    lastUpdUser: string;
    operationCd: string;
    resourceByPriorityList: SecurityRoleResource[];
    securityAppEaiNbr: number;
    securityGroupRoleList: SecurityGroupRole[];
    securityGroupUuid: string;
};

type SecurityUserRole = {
    changeFlag: string;
    lastUpdDtTm: string;
    lastUpdUser: string;
    operationCd: string;
    phxUser: PhxUser;
    securityAppEaiNbr: string;
    securityRole: SecurityRole;
    securityUserRoleUuid: string;
};

type SecurityRole = {
    changeFlag: string;
    lastUpdDtTm: string;
    lastUpdUser: string;
    operationCd: string;
    roleDesc: string;
    roleName: string;
    securityAppEaiNbr: string;
    securityRoleResourceList: SecurityRoleResource;
    securityRoleUuid: string;
};

export type { SecurityUserGroup, PhxUser, SecurityUserRole, SecurityRole, SecurityGroup };