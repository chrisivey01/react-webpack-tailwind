export interface SecurityResource {
    SECURITY_RESOURCE_UUID: string;
    SECURITY_ACTION_UUID?: string;
    SECURITY_APP_EAI_NBR: number;
    RESOURCE_NAME: string;
    RESOURCE_DESC: string;
    LAST_UPD_DT_TM: string;
    LAST_UPD_USER: string;
    CHANGE_FLAG: string;
    ACTION?:string;
    ACTION_NAME?: string;
    COLOR?: string;
    OPERATION_CODE?: string;
    FONT_SIZE?: number;
    FONT_STYLE?: string;
}