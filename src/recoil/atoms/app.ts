import { atom, useSetRecoilState } from "recoil";

interface AppState {
    appId: string;
}

export const appState = atom({
    key: "app",
    default: {} as AppState
});

export const useApp = () => useSetRecoilState(appState);