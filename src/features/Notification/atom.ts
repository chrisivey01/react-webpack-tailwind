import { atom, useSetRecoilState } from "recoil";


export enum Severity {
    error = "error",
    warning = "warning",
    info = "info",
    success = "success"
}

export type NotificationState = {
    show: boolean;
    message: string;
    severity: Severity;
};


export const notificationState = atom({
    key: "notification",
    default: {
        show: false,
        message: '',
        severity: Severity.success
    } as NotificationState
});

export const useNotification = () => useSetRecoilState(notificationState);