import { Autocomplete, Box, Divider, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { ChangeEvent, useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
    SecurityResource,
    SecurityResourceList,
    SecurityRole,
    SecurityRoleList,
    SecurityRoleResource
} from "../../../types/SecurityRole";
import {
    SECURITY_RESOURCE_REQUEST,
    SECURITY_ROLE_LIST_REQUEST,
    SECURITY_ROLE_REQUEST
} from "../../apis";
import { httpRequestList } from "../../apis/requests";
import { appState } from "../../atom/app";
import { PageWrapper } from "../styles";
import { createRoleState } from "./atoms/createRole";
import { rolesState, useRoles } from "./atoms/roles";
import { RoleDescField, RoleNameField } from "./styles";
import { RoleTable } from "./Table/RoleTable";

export const Roles = () => {
    const roles = useRecoilValue(rolesState);
    const createRole = useRecoilValue(createRoleState);
    const setRoles = useRoles();
    const app = useRecoilValue(appState);

    useEffect(() => {
        if (app.appId) {
            fetchRoleMasterList();
            fetchResourceMasterList();
        }
    }, [app.appId]);

    useEffect(() => {
        if (!roles.savePending && roles.roleSelected) {
            changeRole(roles.roleSelected);
        }
    }, [roles.savePending]);

    const fetchRoleMasterList = async () => {

        const params = {
            securityAppEaiNbr: app.appId,
            userId: app.employee.employeeId,
        };
        const results: SecurityRoleList = await httpRequestList(
            SECURITY_ROLE_LIST_REQUEST,
            params
        );
        if (results) {
            setRoles((state) => ({
                ...state,
                rolesMasterList: results.securityRoleList,
            }));
        }
    };

    const fetchResourceMasterList = async () => {
        const params = {
            securityAppEaiNbr: app.appId,
            userId: app.employee.employeeId,
        };
        const results: SecurityResourceList = await httpRequestList(
            SECURITY_RESOURCE_REQUEST,
            params
        );
        if (results) {
            setRoles((state) => ({
                ...state,
                resourcesMasterList: results.resourceList,
            }));
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

        let copyRoleSelected = JSON.parse(JSON.stringify(roles.roleSelected));

        copyRoleSelected.roleDesc = e.target.value;
        if (!createRole.createdPending) {
            copyRoleSelected.operationCd = "M";
        }
        setRoles((state) => ({
            ...state,
            roleSelected: copyRoleSelected,
            savePending: true
        }));
    };

    const changeRole = async (option: SecurityRole) => {
        if (option) {
            setRoles((state: any) => ({
                ...state,
                savePending: false
            }));
            const securityRoleName = option.roleName;
            const params = {
                fetchResources: true,
                roleNameList: [securityRoleName],
                securityAppEaiNbr: app.appId,
                userId: app.employee.employeeId,
            };
            const results: SecurityRoleList = await httpRequestList(
                SECURITY_ROLE_REQUEST,
                params
            );

            let roleSelectedResponse: SecurityRole = results.securityRoleList[0];

            let resourcesFromRole = roleSelectedResponse.securityRoleResourceList;

            let tableView: any[] = [];

            if (resourcesFromRole) {
                resourcesFromRole.map((roleResource: SecurityRoleResource) => {
                    roles.resourcesMasterList.map(
                        (masterResource: SecurityResource) => {
                            if (
                                roleResource.securityResource &&
                                roleResource.securityResource
                                    .securityResourceUuid ===
                                masterResource.securityResourceUuid
                            ) {
                                const merged = {
                                    ...roleResource,
                                    ...masterResource,
                                };
                                tableView.push(merged);
                            }
                        }
                    );
                });
            }

            setRoles((state) => ({
                ...state,
                filteredResourceList: tableView,
                roleSelected: roleSelectedResponse,
            }));
        } else {
            setRoles((state) => ({
                ...state,
                filteredResourceList: [],
                roleSelected: {
                    ...state,
                    roleName: '',
                    roleDesc: ''
                },
            }));
        }
    };

    return (
        <PageWrapper>
            <Box style={{ width: "50%", padding: 10 }}>
                <Autocomplete
                    size="small"
                    fullWidth
                    options={roles.rolesMasterList ?? []}
                    disableClearable={true}
                    // value={roles.roleSelected ? roles.roleSelected.roleName : undefined}
                    getOptionLabel={(option: any) => option.roleName ?? option}
                    isOptionEqualToValue={(option: any, value: any) =>
                        option.roleName === value.roleName
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            label="Roles"
                            margin="normal"
                        />
                    )}
                    onChange={(e, option: any) => changeRole(option)}
                    renderOption={(props, option: any, { inputValue }) => {
                        const matches = match(option.roleName, inputValue);
                        const parts = parse(option.roleName, matches);

                        return (
                            <li {...props}>
                                <div>
                                    {parts.map((part: any, index: number) => (
                                        <span key={index}>{part.text}</span>
                                    ))}
                                </div>
                            </li>
                        );
                    }}
                />
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box style={{ width: "50%", padding: 10 }}>
                {roles.roleSelected && roles.roleSelected.roleName !== "" ? (
                    <>
                        <RoleNameField
                            sx={{
                                "& .Mui-disabled": {
                                    WebkitTextFillColor: "black !important"
                                }
                            }}
                            label="Role Name"
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                            value={roles.roleSelected.roleName ?? ""}
                        />
                        <RoleDescField
                            label="Role Description"
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={roles.roleSelected.roleDesc ?? ""}
                            onChange={handleChange}
                            style={{ width: "90%" }}
                        />
                    </>
                ) : (
                    <></>
                )}
            </Box>

            <Divider
                orientation="horizontal"
                flexItem
                style={{ paddingBottom: "5px" }}
            />
            {roles.roleSelected ? <RoleTable /> : <></>}
        </PageWrapper>
    );
};
