import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { Action, ActionList } from "../../../types/ActionList";
import { SECURITY_ACTION_REQUEST } from "../../apis";
import { httpRequestList } from "../../apis/requests";
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

    const actionOptionsTable: string[] = ['View', 'Edit'];

    const actionSelectorHandler = async (option: any, value: any) => {
        const pickedAction = value.props.value;
        let actionType;
        if (pickedAction === 'Edit' || pickedAction === 'View') {
            actionType = 'EDIT_VIEW_TYPE';
        } else if (pickedAction === 'Access') {
            actionType = 'ACCESS_TYPE';
        } else {
            actionType = 'HAVE_TYPE';
        }

        const params = {
            securityAppEaiNbr: app.appId,
            userId: app.employee.employeeId,
            actionType: actionType
        };

        const results: ActionList = await httpRequestList(
            SECURITY_ACTION_REQUEST,
            params
        );
        if (table && index !== undefined) {

            let rolesCopy = JSON.parse(JSON.stringify(roles.roleSelected));

            if (createRole.createdPending) {
                rolesCopy.operationCd = "I";
                rolesCopy.securityRoleResourceList[index].operationCd = "I";
            } else {
                /**
                 * If new resource insert with insert opcode, if not, leave opcode for modify as updated role.
                 */
                if (rolesCopy.securityRoleResourceList[index].newResource) {
                    rolesCopy.securityRoleResourceList[index].operationCd = "I";
                } else {
                    rolesCopy.securityRoleResourceList[index].operationCd = "M";
                }
                rolesCopy.operationCd = "M";
                rolesCopy.securityAction = results.actionList.filter((action: Action) => action.actionName === pickedAction)[0];

            }
            rolesCopy.securityRoleResourceList[index].securityAction = results.actionList.filter((action: Action) => action.actionName === pickedAction)[0];
            rolesCopy.securityRoleResourceList[index].fontStyle = "italic";
            rolesCopy.securityRoleResourceList[index].fontSize = 600;
            rolesCopy.securityRoleResourceList[index].lastUpdDtTm = new Date().toISOString();
            rolesCopy.securityRoleResourceList[index].lastUpdUser = app.employee.employeeId;
            setRoles((state) => ({
                ...state,
                roleSelected: rolesCopy,
            }));
        } else {
            const action = results.actionList.filter((action: Action) => action.actionName === pickedAction)[0];
            setCreateRole((state) => ({ ...state, actionSelected: action }));
        }
    };

    const tableSelectorOrCreateSelector = () => {
        if (rowData && rowData.securityAction) {
            if (rowData.securityResource.actionTypeName === "EDIT_VIEW_TYPE" || rowData.actionTypeName === "EDIT_VIEW_TYPE") {
                return (
                    <SelectAction
                        onChange={actionSelectorHandler}
                        value={rowData.securityAction.actionName}
                    >
                        {actionOptionsTable.map(
                            (option: any, index: number) => (
                                <MenuItem
                                    key={index}
                                    value={option}
                                    style={{ fontSize: 12 }}
                                >
                                    {option}
                                </MenuItem>
                            )
                        )}
                    </SelectAction>
                );
            } else {
                return <Box>{rowData.securityAction.actionName}</Box>;
            }
        } else {
            return (
                <SelectAction
                    value={createRole.actionSelected?.actionName ?? ""}
                    onChange={actionSelectorHandler}
                >
                    {actionOptionsTable.map(
                        (option: any, index: number) => (
                            <MenuItem
                                key={index}
                                value={option}
                                style={{ fontSize: 12 }}
                            >
                                {option}
                            </MenuItem>
                        )
                    )}
                </SelectAction>
            );
        }
    };

    return (
        <FormControl>
            <Box style={{ display: "flex", alignItems: "center", margin: 8 }}>
                {tableSelectorOrCreateSelector()}
            </Box>
        </FormControl>
    );
};
