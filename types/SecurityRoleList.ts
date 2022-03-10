type SecurityRoleList = {
    securityRoleList: SecurityRole[];
    securityRoleResourceList?: SecurityRoleResource[];
};

type SecurityRole = {
    roleDesc: string;
    roleName: string;
    securityAppEaiNbr: number;
    lastUpdDtTm?: Date;
    operationCd?: string;
    changeFlag?: string;
    securityAppEarNbr: number;
    securityRoleResourceList: SecurityRoleResource[];
};

type SecurityRoleResourceList = {
    resourceList: SecurityRoleResource[];
};

type SecurityRoleResource = {
    changeFlag?: string;
    lastUpdDtTm?: Date;
    operationCd?: string,
    securityAction?: SecurityAction;
    securityAppEaiNbr?: number,
    securityResource?: SecurityResource,
    securityRoleResourceUuid?: string;
    resourceName?: string;
    securityResourceUuid?: string;
};

type SecurityResourceList = {
    resourceList: SecurityResource[];
};

type SecurityResource = {
    changeFlag?: string,
    lastUpdDtTm?: {
        date?: number,
        hours?: number,
        minutes?: number,
        month?: number,
        nanos?: number,
        seconds?: number,
        time?: number,
        year?: number;
    },
    lastUpdUser?: string,
    operationCd?: string,
    resourceName?: string,
    securityAppEaiNbr?: number,
    securityResourceUuid?: string;
    securityResource: SecurityRoleResource;
    securityAction?: SecurityAction;
};

type SecurityAction = {
    actionDesc?: string,
    actionName?: string,
    changeFlag?: string,
    lastUpdDtTm?: {
        date?: number,
        hours?: number,
        minutes?: number,
        month?: number,
        nanos?: number,
        seconds?: number,
        time?: number,
        year?: number;
    },
    lastUpdUser?: string,
    operationCd?: string,
    priorityNbr?: number,
    securityActionUuid?: string,
    securityAppEaiNbr?: number;
};

export type { SecurityRoleList, SecurityRole, SecurityRoleResource, SecurityRoleResourceList, SecurityResource, SecurityResourceList, SecurityAction };