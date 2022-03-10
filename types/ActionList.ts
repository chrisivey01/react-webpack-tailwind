type ActionList = {
    actionList: Action[];
};

type Action = {
    actionDesc: string,
    actionName: string,
    changeFlag: string,
    lastUpdDtTm: {
        date: number,
        hours: number,
        minutes: number,
        month: number,
        nanos: number,
        seconds: number,
        time: number,
        year: number;
    },
    lastUpdUser: string,
    operationCd: string,
    priorityNbr: number,
    securityActionUuid: string,
    securityAppEaiNbr: number;
};

export type { ActionList, Action };