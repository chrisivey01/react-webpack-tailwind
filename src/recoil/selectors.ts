import { selector } from "recoil";
import { creatorState } from "./atoms/creator";

export const creatorSelector = selector({
    key: 'filter',
    get: ({ set, get }) => {
        const creator = get(creatorState);
    }
});
