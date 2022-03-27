import { Action, SecurityActionType } from "./ActionList";

type SecurityRoleList = {
    securityRoleList: SecurityRole[];
    securityRoleResourceList?: SecurityRoleResource[];
};

type SecurityRole = {
    roleDesc?: string;
    roleName?: string;
    lastUpdDtTm?: string;
    operationCd?: string;
    changeFlag?: string;
    securityAppEaiNbr?: number;
    securityRoleResourceList?: any[];
    securityRoleUuid?: string;
};

type SecurityRoleResourceList = {
    resourceList: SecurityRoleResource[];
};

type SecurityRoleResource = {
    changeFlag?: string;
    lastUpdDtTm?: string;
    operationCd?: string,
    securityAction?: Action;
    securityAppEaiNbr?: number,
    securityResource?: SecurityResource,
    securityRoleResourceUuid?: string;
    resourceName?: string;
    securityResourceUuid?: string;
    color?: string;
    fontStyle?: string;
    fontSize?: string;
};

type SecurityResourceList = {
    resourceList: SecurityResource[];
};

type SecurityResource = {
    changeFlag?: string;
    lastUpdDtTm?: string;
    lastUpdUser?: string;
    operationCd?: string;
    resourceName?: string;
    resourceDesc?: string;
    securityAppEaiNbr?: number;
    securityResourceUuid?: string;
    securityResource?: SecurityRoleResource;
    securityAction?: Action;
    actionTypeName?: string;
    securityActionType?: SecurityActionType;
    color?: string;
    fontSize?: string;
    fontStyle?: string;
};

type SecurityRoleListSaveList = {
    securityRoleList: SecurityRole[];
};
type SecurityRoleListSave = {
    changeFlag?: string,
    lastUpdDtTm?: string,
    lastUpdUser?: string,
    operationCd?: string,
    roleDesc?: string,
    roleName?: string,
    securityAppEaiNbr?: number,
    securityRoleResourceList?: [
        {
            changeFlag?: string,
            lastUpdDtTm?: string,
            lastUpdUser?: string,
            operationCd?: string,
            securityAction?: Action,
            securityAppEaiNbr?: number,
            securityResource?: {
                changeFlag?: string,
                lastUpdDtTm?: string,
                lastUpdUser?: string,
                operationCd?: string,
                resourceName?: string,
                securityAppEaiNbr?: number,
                securityResourceUuid?: string;
            },
            securityRoleResourceUuid?: string;
        }
    ],
    securityRoleUuid?: string;

};


export type { SecurityRoleList, SecurityRole, SecurityRoleResource, SecurityRoleResourceList, SecurityResource, SecurityResourceList, SecurityRoleListSave, SecurityRoleListSaveList };