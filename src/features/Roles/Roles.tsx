import { Autocomplete, Box, Divider } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
    SecurityRole,
    SecurityRoleList,
    SecurityRoleResource,
    SecurityRoleResourceList,
    SecurityResourceList,
    SecurityResource,
} from "../../../types/SecurityRoleList";
// import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import {
    SECURITY_RESOURCE_LIST_REQUEST,
    SECURITY_RESOURCE_REQUEST,
    SECURITY_ROLE_LIST_REQUEST,
    SECURITY_ROLE_REQUEST,
} from "../../apis";
import { httpRequestList } from "../../apis/requests";
import { appState } from "../../recoil/atoms/app";
import { rolesState, useRoles } from "./atom/roles";
import { PageContainer, PageWrapper } from "../styles";
import { RoleDescField, RoleField } from "./styles";
import { RoleTable } from "./Table/RoleTable";

export const Roles = () => {
    const roles = useRecoilValue(rolesState);
    const setRoles = useRoles();
    const app = useRecoilValue(appState);

    useEffect(() => {
        if (app.appId) {
            fetchRoleMasterList();
            fetchResourceMasterList();
            fetchSecurityActionList();
        }
    }, [app.appId]);

    const fetchRoleMasterList = async () => {
        const params = {
            securityAppEaiNbr: app.appId,
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

    const fetchSecurityActionList = async () => {};

    const handleChange = () => {};

    const changeRole = async (option: SecurityRole) => {
        if (option === null) return;
        const securityRoleName = option.roleName;
        const params = {
            fetchResources: true,
            roleNameList: [securityRoleName],
            securityAppEaiNbr: app.appId,
        };
        const results: SecurityRoleList = await httpRequestList(
            SECURITY_ROLE_REQUEST,
            params
        );

        let roleSelectedResponse: SecurityRole = results.securityRoleList[0];

        let resourcesFromRole =
            roleSelectedResponse.securityRoleResourceList;

        let tableView: any[] = [];

        resourcesFromRole.map((roleResource: SecurityRoleResource) => {
            roles.resourcesMasterList.map(
                (masterResource: SecurityResource) => {
                    if (
                        roleResource.securityResource &&
                        roleResource.securityResource.securityResourceUuid ===
                            masterResource.securityResourceUuid
                    ) {
                        const merged = { ...roleResource, ...masterResource };
                        tableView.push(merged);
                    }
                }
            );
        });

        setRoles((state) => ({
            ...state,
            filteredResourceList: tableView,
            roleSelected: roleSelectedResponse,
        }));
    };

    return (
        <PageWrapper>
            <PageContainer>
                <Box style={{ width: "50%", padding: 10 }}>
                    <Autocomplete
                        size="small"
                        fullWidth
                        options={roles.rolesMasterList}
                        getOptionLabel={(option: any) => option.roleName}
                        renderInput={(params) => (
                            <RoleField
                                {...params}
                                size="small"
                                label="Roles"
                                margin="normal"
                            />
                        )}
                        onChange={(e, option: any) => changeRole(option)}
                        renderOption={(props, option, { inputValue }) => {
                            const matches = match(option.roleName, inputValue);
                            const parts = parse(option.roleName, matches);

                            return (
                                <li {...props}>
                                    <div>
                                        {parts.map(
                                            (part: any, index: number) => (
                                                <span key={index}>
                                                    {part.text}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </li>
                            );
                        }}
                    />
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box style={{ width: "50%", padding: 10 }}>
                    {roles.roleSelected &&
                    roles.roleSelected.roleName !== "" ? (
                        <>
                            <RoleField
                                label="Role Name"
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={roles.roleSelected.roleName ?? ""}
                                onChange={handleChange}
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
            </PageContainer>

            <Divider
                orientation="horizontal"
                flexItem
                style={{ paddingBottom: "5px" }}
            />
            {roles.roleSelected ? <RoleTable /> : <></>}
        </PageWrapper>
    );
};
