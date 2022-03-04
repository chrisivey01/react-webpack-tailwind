import { LoggedInUser } from './../../../types/LoggedInUser';
import { atom, useSetRecoilState } from "recoil";

interface AppState {
    appId: string;
    employee: LoggedInUser;
}

export const appState = atom({
    key: "app",
    default: {} as AppState
});

export const useApp = () => useSetRecoilState(appState);