import { Autocomplete, Box, Divider, Grid, TextField } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
    SecurityResource,
    SecurityRole,
    SecurityRoleList,
    SecurityRoleResource,
} from "../../../../types/SecurityRole";
import { SECURITY_ROLE_REQUEST } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { appState } from "../../../atom/app";
import { Severity, useNotification } from "../../Notification/atom";
import { Selector } from "../../Selector/Selector";
import { Button } from "../../styles";
import { createRoleState, useCreateRole } from "../atoms/createRole";
import { rolesState, useRoles } from "../atoms/roles";
import { RoleDescField, RoleNameField } from "../styles";

export const RolePopup = () => {
    const app = useRecoilValue(appState);
    const setRole = useRoles();
    const setCreateRole = useCreateRole();
    const roles = useRecoilValue(rolesState);
    const createRole = useRecoilValue(createRoleState);
    const setNotification = useNotification();

    const roleSelectHandler = async (option: any, value: any) => {
        let roleList: string[] = [];
        value.map((opt: any) => {
            if (opt.roleName) {
                roleList.push(opt.roleName);
            } else {
                roleList.push(opt);
            }
        });
        const params = {
            fetchResources: true,
            roleNameList: roleList,
            securityAppEaiNbr: app.appId,
        };
        const results: SecurityRoleList = await httpRequestList(
            SECURITY_ROLE_REQUEST,
            params
        );
        let securityRoleList: SecurityRole[] = results.securityRoleList;
        let resourcesSelected: SecurityResource[] = [];
        let securityRoleResourceList: any[] = [];
        if (securityRoleList) {
            securityRoleList.map((sr: SecurityRole) => {
                if (sr.securityRoleResourceList) {
                    sr.securityRoleResourceList.map(
                        (srrl: SecurityRoleResource) => {
                            if (srrl.securityResource) {
                                let obj = {
                                    securityAppEaiNbr: app.appId,
                                    operationCd: "I",
                                    securityResource: srrl.securityResource,
                                    securityAction: srrl.securityAction,
                                };
                                resourcesSelected.push(srrl.securityResource);
                                securityRoleResourceList.push(obj);
                            }
                        }
                    );
                }
            });
        }

        setCreateRole((state) => ({
            ...state,
            securityRoleResourceList: securityRoleResourceList,
            resourcesFiltered: resourcesSelected,
            rolesFiltered: securityRoleList,
            rolesSelected: roleList,
        }));
    };

    const resourceSelectHandler = (
        option: any,
        resourceList: SecurityResource[]
    ) => {
        let copySecurityRoleResourceList = JSON.parse(
            JSON.stringify(createRole.securityRoleResourceList)
        );
        let resourceObj = { ...resourceList[resourceList.length - 1] };
        if (createRole.actionSelected) {
            resourceObj.securityAction = createRole.actionSelected;
            resourceObj.securityResource = {
                resourceName: resourceObj.resourceName,
                securityAppEaiNbr: app.appId,
                securityResourceUuid: resourceObj.securityResourceUuid,
                operationCd: "I",
            };
            /**
             * This edits display string last.
             */
            resourceObj.resourceName =
                resourceObj.resourceName +
                " - " +
                createRole.actionSelected.actionName.toUpperCase();
            resourceObj.operationCd = "I";
            resourceList[resourceList.length - 1] = resourceObj;
            copySecurityRoleResourceList.push(resourceObj);
            setCreateRole((state) => ({
                ...state,
                resourcesFiltered: resourceList,
                securityRoleResourceList: copySecurityRoleResourceList,
            }));
        } else {
            //notification needed for action needs selected
            setNotification((state) => ({
                ...state,
                show: true,
                message:
                    "You cannot add a resource manually, without an action selected.",
                severity: Severity.error,
            }));
        }
    };

    const roleCreateHandler = () => {
        if (createRole.role) {
            setCreateRole((state) => ({
                ...state,
                createdPending: true,
                show: false,
            }));

            let rolesMasterListCopy = JSON.parse(JSON.stringify(roles.rolesMasterList));
            rolesMasterListCopy.push({
                securityAppEaiNbr: app.appId,
                roleName: createRole.role.roleName,
                roleDesc: createRole.role.roleDesc
            });
            let roleSelectedCopy: SecurityRole;
            if (roles.roleSelected) {
                roleSelectedCopy = {
                    securityAppEaiNbr: app.appId,
                    operationCd: "I",
                    roleName: createRole.role.roleName,
                    roleDesc: createRole.role.roleDesc,
                    securityRoleResourceList: createRole.securityRoleResourceList
                };
            } else {
                roleSelectedCopy = {
                    securityAppEaiNbr: app.appId,
                    operationCd: "I",
                    roleName: createRole.role.roleName,
                    roleDesc: createRole.role.roleDesc,
                    securityRoleResourceList: createRole.securityRoleResourceList
                };
            }
            setRole((state) => ({
                ...state,
                rolesMasterList: rolesMasterListCopy,
                roleSelected: roleSelectedCopy,
                filteredResourceList: createRole.securityRoleResourceList
            }));
        };
    };

    const roleNameHandler = (event: any) => {
        let roleFields = { ...createRole.role };
        roleFields.roleName = event.target.value;
        setCreateRole((state) => ({ ...state, role: roleFields }));
    };

    const roleDescHandler = (event: any) => {
        let roleFields = { ...createRole.role };
        roleFields.roleDesc = event.target.value;
        setCreateRole((state) => ({ ...state, role: roleFields }));
    };

    return (
        <>
            <Grid>
                <Box>
                    <RoleNameField
                        label={"Role Name"}
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={roleNameHandler}
                    />
                    <RoleDescField
                        label={"Role Description"}
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={roleDescHandler}
                    />
                </Box>
                <Divider style={{ margin: 10 }} />
                <Box>
                    <Autocomplete
                        size="small"
                        multiple
                        id="tags-outlined"
                        value={createRole.rolesSelected ?? []}
                        options={roles.rolesMasterList}
                        onChange={roleSelectHandler}
                        getOptionLabel={(option: any) => option.roleName ?? option}
                        isOptionEqualToValue={(option: any, value: any) =>
                            option.roleName === value
                        }
                        filterSelectedOptions
                        autoHighlight
                        autoSelect
                        sx={{ maxHeight: 120, maxWidth: 570, overflow: "auto" }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Select Role to Copy"}
                                style={{ fontSize: 12 }}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />
                    <Box sx={{ fontSize: 12, display: "flex", alignItems: "center", paddingLeft: "5px" }}>
                        Action Selected <Selector />
                    </Box>
                    <Autocomplete
                        size="small"
                        multiple
                        id="tags-outlined"
                        options={roles.resourcesMasterList}
                        value={createRole.resourcesFiltered ?? []}
                        getOptionLabel={(option: any) => option.resourceName}
                        isOptionEqualToValue={(option: any, value: any) =>
                            option.securityResourceUuid === value.securityResourceUuid
                        }
                        filterSelectedOptions
                        autoHighlight
                        autoSelect
                        onChange={resourceSelectHandler}
                        sx={{
                            height: 305,
                            maxHeight: location.pathname !== "/roles" ? 305 : 220,
                            overflow: "auto",
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Select Resources"}
                                style={{ fontSize: 12 }}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />
                </Box>
            </Grid>
            <Box
                style={{
                    bottom: 10,
                    right: 10,
                    position: "absolute",
                }}
            >
                <Button onClick={() => roleCreateHandler()}>
                    Ok
                </Button>
                <Button
                    onClick={() =>
                        setCreateRole((state) => ({ ...state, show: false }))
                    }
                >
                    Cancel
                </Button>
                <Button
                    onClick={() =>
                        setCreateRole((state) => ({
                            ...state,
                            rolesSelected: [],
                            resourcesFiltered: [],
                            securityRoleList: [],
                            actionSelected: undefined,
                            rolesFiltered: [],
                            securityRoleResourceList: [],
                            role: {
                                roleName: "",
                                roleDesc: "",
                            },
                        }))
                    }
                >
                    Reset
                </Button>
            </Box>
        </>
    );
};