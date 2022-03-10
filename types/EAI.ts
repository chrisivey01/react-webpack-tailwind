import { LastUpdDtTm } from "./LastUpdDtTm";

export interface EAI {
    securityAppEaiNbr: number;
    appName: string;
    appLdapRoleName?: string;
    changeFlag?: string;
    lastUpdDtTm?: LastUpdDtTm;
    lastUpdUser?: string;
    operationCd?: string;
}