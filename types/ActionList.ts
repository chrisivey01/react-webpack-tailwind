type ActionList = {
    actionList: Action[];
};

type Action = {
    actionDesc: string,
    actionName: string,
    changeFlag: string,
    lastUpdDtTm: string,
    lastUpdUser: string,
    operationCd: string,
    priorityNbr: number,
    securityActionUuid: string,
    securityAppEaiNbr: number;
};

export type { ActionList, Action };