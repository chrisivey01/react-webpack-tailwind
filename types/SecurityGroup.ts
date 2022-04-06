type SecurityGroupResource = {
    color?: string;
    fontStyle?: string;
    fontSize?: number | string;
    changeFlag: string;
    lastUpdDtTm: string;
    lastUpdUser: string;
    operationCd: string;
    securityAction: {
        actionDesc: string;
        actionName: string;
        changeFlag: string;
        lastUpdDtTm: string;
        lastUpdUser: string;
        operationCd: string;
        priorityNbr: 0;
        securityActionUuid: string;
        securityAppEaiNbr: 0;
    };
    securityAppEaiNbr: 0;
    securityResource: {
        changeFlag: string;
        lastUpdDtTm: string;
        lastUpdUser: string;
        operationCd: string;
        resourceName: string;
        securityAppEaiNbr: 0;
        securityResourceUuid: string;
    };
    securityRole: {
        changeFlag: string;
        lastUpdDtTm: string;
        lastUpdUser: string;
        operationCd: string;
        roleDesc: string;
        roleName: string;
        securityAppEaiNbr: 0;
        securityRoleResourceList: any[];
        securityRoleUuid: string;
    };
    securityRoleResourceUuid: string;
};

type SecurityGroupList = {
    securityGroupList: SecurityGroup[];
};

type SecurityGroup = {
    changeFlag?: string;
    groupName?: string;
    lastUpdDtTm?: string;
    lastUpdUser: string;
    operationCd: string;
    resourceByPriorityList: SecurityGroupResource[];
    securityAppEaiNbr: number;
    securityGroupRoleList: SecurityGroupRole[] | any;
    securityGroupUuid?: string;
};

type SecurityGroupRole = {
    added?: boolean;
    deleted?: boolean;
    changeFlag: string;
    lastUpdDtTm: string;
    lastUpdUser: string;
    operationCd: string;
    securityAppEaiNbr: number;
    securityGroupRoleUuid: string;
    securityRole: {
        changeFlag: string;
        lastUpdDtTm: string;
        lastUpdUser: string;
        operationCd: string;
        roleDesc: string;
        roleName: string;
        securityAppEaiNbr: number;
        securityRoleResourceList: any[];
        securityRoleUuid: string;
    };
    resourceByPriorityList: SecurityGroupResource[];
};


export type { SecurityGroup, SecurityGroupList, SecurityGroupRole, SecurityGroupResource };