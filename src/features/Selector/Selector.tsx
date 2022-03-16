import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { Action } from "../../../types/ActionList";
import { appState } from "../../atom/app";
import { createRoleState, useCreateRole } from "../Roles/atoms/createRole";
import { rolesState, useRoles } from "../Roles/atoms/roles";

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
    const setRoles = useRoles();
    const createRole = useRecoilValue(createRoleState);
    const setCreateRole = useCreateRole();

    const app = useRecoilValue(appState);

    const actionOptionsTable: Action[] = app.actionList;

    let actionOptionsCreate: Action[] = [];
    app.actionList.map((act: Action) => {
        if (act.actionName === "View" || act.actionName === "Edit") {
            actionOptionsCreate.push(act);
        }
    });

    const actionSelectorHandler = (option: any) => {
        if (table && index !== undefined) {
            let rolesCopy = JSON.parse(JSON.stringify(roles.roleSelected));

            let action = app.actionList.filter(
                (act: Action) => act.actionName === option.target.value
            )[0];
            rolesCopy.operationCd = "M";
            rolesCopy.securityRoleResourceList[index].securityAction = action;
            rolesCopy.fontStyle = "italic";
            rolesCopy.fontSize = 600;
            rolesCopy.lastUpdDtTm = new Date().toISOString();
            rolesCopy.lastUpdUser = app.employee.employeeId;
            setRoles((state) => ({
                ...state,
                roleSelected: rolesCopy,
            }));
        } else {
            const action = app.actionList.filter(
                (act: Action) => act.actionName === option.target.value
            )[0];
            setCreateRole((state) => ({ ...state, actionSelected: action }));
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
                    <SelectAction
                        onChange={actionSelectorHandler}
                        value={
                            createRole.actionSelected
                                ? createRole.actionSelected.actionName
                                : ""
                        }
                    >
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
