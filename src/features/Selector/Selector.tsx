import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { creatorState, useCreator } from "../../recoil/atoms/creator";
import { rolesState, useRoles } from "../../recoil/atoms/roles";
import { appState } from "../../recoil/atoms/app";
import { Action } from "../../../types/ActionList";

const SelectAction = styled(Select)`
    font-size: 12px;
    width: auto !important;
    min-width: 70px;
    margin-left: 3px;
    padding: 0px !important;

    .MuiInputBase-input {
        padding: 5px;
    }
`;

interface Props {
    rowData?: any;
    options?: any;
    table?: boolean;
    index?: number;
}

export const Selector = ({ rowData, table, index }: Props) => {
    const roles = useRecoilValue(rolesState);
    const creator = useRecoilValue(creatorState);
    const setRoles = useRoles();
    const setCreator = useCreator();

    const app = useRecoilValue(appState);

    const actionOptionsTable: Action[] = app.actionList;

    let actionOptionsCreate: Action[] = [];
    app.actionList.map((act: Action) => {
        if (act.actionName === "View" || act.actionName === "Edit") {
            actionOptionsCreate.push(act);
        }
    });

    const actionSelectorHandler = (option: any) => {
        if (table) {
            let filteredResourceListCopy: any[] = [
                ...roles.filteredResourceList,
            ];
            let copyObj = { ...filteredResourceListCopy[index] };
            const action = app.actionList.filter(
                (act: Action) => act.actionName === option.target.value
            )[0];
            copyObj.securityAction = action;
            copyObj.FONT_STYLE = "italic";
            copyObj.FONT_SIZE = 600;
            filteredResourceListCopy[index] = copyObj;
            setRoles((state) => ({
                ...state,
                filteredResourceList: filteredResourceListCopy,
            }));
        } else {
            const action = app.actionList.filter(
                (act: Action) => act.actionName === option.target.value
            )[0];
            setCreator((state) => ({ ...state, actionSelected: action }));
        }
    };

    return (
        <FormControl>
            <Box style={{ display: "flex", alignItems: "center", margin: 8 }}>
                {rowData && rowData.securityAction ? (
                    <SelectAction
                        onChange={actionSelectorHandler}
                        value={rowData.securityAction.actionName ?? {}}
                    >
                        {actionOptionsTable.map(
                            (option: any, index: number) => (
                                <MenuItem
                                    key={index}
                                    value={option.actionName}
                                    style={{ fontSize: 12 }}
                                >
                                    {option.actionName}
                                </MenuItem>
                            )
                        )}
                    </SelectAction>
                ) : (
                    <SelectAction onChange={actionSelectorHandler} value={creator.actionSelected ? creator.actionSelected.actionName : ""}>
                        {actionOptionsCreate.map(
                            (option: any, index: number) => (
                                <MenuItem
                                    key={index}
                                    value={
                                        option.actionName
                                            .charAt(0)
                                            .toUpperCase() +
                                        option.actionName.slice(1)
                                    }
                                    style={{ fontSize: 12 }}
                                >
                                    {option.actionName}
                                </MenuItem>
                            )
                        )}
                    </SelectAction>
                )}
            </Box>
        </FormControl>
    );
};
