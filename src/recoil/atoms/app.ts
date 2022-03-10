import { EAI } from './../../../types/EAI';
import { LoggedInUser } from './../../../types/LoggedInUser';
import { atom, useSetRecoilState } from "recoil";
import { Action } from "../../../types/ActionList";

interface AppState {
    appEaiList: EAI[];
    appId: number;
    employee: LoggedInUser;
    actionList: Action[];
}

export const appState = atom({
    key: "app",
    default: {} as AppState
});

export const useApp = () => useSetRecoilState(appState);