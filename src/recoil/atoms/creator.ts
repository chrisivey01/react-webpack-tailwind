import { atom, useSetRecoilState } from "recoil";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";

interface CreatorState {
    rolesSelected: SecurityRole[];
    resourcesFiltered: SecurityResource[];
    actionSelected: string;
    groupGroupSelected?: SecurityGroup;
    rolesFiltered: SecurityRole[];
}

export const creatorState = atom({
    key: "creator",
    default: {} as CreatorState
});

export const useCreator = () => useSetRecoilState(creatorState);