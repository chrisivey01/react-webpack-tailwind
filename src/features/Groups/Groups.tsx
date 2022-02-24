import { Autocomplete, Box, Divider, Stack, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityGroupRole } from "../../../types/SecurityGroupRole";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import * as JSON from "../../assets/json";
import { RootState } from "../../store";
import { PageWrapper } from "../styles";
import { SecurityTable } from "../Table/SecurityTable";
import {
    selectedGroupHandler,
    setFilteredResourceList,
    setFilteredRolesList,
    setGroupsMasterList,
    setGroupsRoleMasterList,
    setResourcesMasterList,
    setRolesMasterList,
    setSecurityRoleResourcesMasterList,
} from "./groups-slice";

export const Groups = () => {
    const dispatch = useDispatch();
    const groupsRoleMasterList = useSelector(
        (state: RootState) => state.groups.groupsRoleMasterList
    );
    const groupsMasterList = useSelector(
        (state: RootState) => state.groups.groupsMasterList
    );
    const rolesMasterList = useSelector(
        (state: RootState) => state.groups.rolesMasterList
    );
    const resourcesMasterList = useSelector(
        (state: RootState) => state.groups.resourcesMasterList
    );
    const selectedGroup = useSelector(
        (state: RootState) => state.groups.selectedGroup
    );
    const securityRoleResourcesMasterList = useSelector(
        (state: RootState) => state.groups.securityRoleResourcesMasterList
    );
    const resourcesFilteredList = useSelector(
        (state: RootState) => state.groups.resourcesFilteredList
    );
    const rolesFilteredList = useSelector(
        (state: RootState) => state.groups.rolesFilteredList
    );

    useEffect(() => {
        dispatch(setGroupsRoleMasterList(JSON.securityGroupRoleJson));
        dispatch(setGroupsMasterList(JSON.securityGroupJson));
        dispatch(setRolesMasterList(JSON.securityRoleJson));
        dispatch(setResourcesMasterList(JSON.securityResourceJson));
        dispatch(
            setSecurityRoleResourcesMasterList(JSON.securityRoleResourceJson)
        );
    }, []);

    const changeGroup = (option: SecurityGroup) => {
        if (option) {
            let securityGroupRoleSelected: SecurityGroupRole[] = [];

            /**
             * Off selected group, filter from master group list to get be prepared
             * to filter off all of the resources.
             */
            groupsRoleMasterList.forEach((sgr: SecurityGroupRole) => {
                if (sgr.SECURITY_GROUP_UUID === option.SECURITY_GROUP_UUID) {
                    securityGroupRoleSelected.push(sgr);
                }
            });

            let securityRoleResourceFiltered: SecurityRoleResource[] = [];

            securityGroupRoleSelected.forEach((sgr: SecurityGroupRole) => {
                securityRoleResourcesMasterList.forEach(
                    (srrml: SecurityRoleResource) => {
                        const indexSearch =
                            securityRoleResourceFiltered.findIndex(
                                (srrf: SecurityRoleResource) =>
                                    srrf.SECURITY_ROLE_UUID ===
                                    sgr.SECURITY_ROLE_UUID
                            );
                        if (
                            indexSearch === -1 &&
                            srrml.SECURITY_ROLE_UUID === sgr.SECURITY_ROLE_UUID
                        ) {
                            securityRoleResourceFiltered.push(srrml);
                        }
                    }
                );
            });

            /**
             * Filter groups down to roles associated with.
             */
            let securityRolesFiltered: SecurityRole[] = [];
            rolesMasterList.forEach((rml: SecurityRole) => {
                securityRoleResourceFiltered.forEach(
                    (srrf: SecurityRoleResource) => {
                        if (
                            rml.SECURITY_ROLE_UUID === srrf.SECURITY_ROLE_UUID
                        ) {
                            securityRolesFiltered.push(rml);
                        }
                    }
                );
            });

            /**
             * Filter from Group -> Role -> Resource
             */
            let securityResourceFiltered: SecurityResource[] = [];
            securityRoleResourceFiltered.forEach(
                (srrf: SecurityRoleResource) => {
                    resourcesMasterList.forEach((rml: SecurityResource) => {
                        if (
                            srrf.SECURITY_RESOURCE_UUID ===
                            rml.SECURITY_RESOURCE_UUID
                        ) {
                            securityResourceFiltered.push(rml);
                        }
                    });
                }
            );
            dispatch(setFilteredRolesList(securityRolesFiltered));
            dispatch(setFilteredResourceList(securityResourceFiltered));
            dispatch(selectedGroupHandler(option));
        }
    };

    const roleHandler = (option: SecurityRole[]) => {
        let securityRoleResourceFiltered: SecurityRoleResource[] = [];

        option.forEach((sgr: SecurityRole) => {
            securityRoleResourcesMasterList.forEach(
                (srrml: SecurityRoleResource) => {
                    const indexSearch = securityRoleResourceFiltered.findIndex(
                        (srrf: SecurityRoleResource) =>
                            srrf.SECURITY_ROLE_UUID === sgr.SECURITY_ROLE_UUID
                    );
                    if (
                        indexSearch === -1 &&
                        srrml.SECURITY_ROLE_UUID === sgr.SECURITY_ROLE_UUID
                    ) {
                        securityRoleResourceFiltered.push(srrml);
                    }
                }
            );
        });

        /**
         * Filter groups down to roles associated with.
         */
        let securityRolesFiltered: SecurityRole[] = [];
        rolesMasterList.forEach((rml: SecurityRole) => {
            securityRoleResourceFiltered.forEach(
                (srrf: SecurityRoleResource) => {
                    if (rml.SECURITY_ROLE_UUID === srrf.SECURITY_ROLE_UUID) {
                        securityRolesFiltered.push(rml);
                    }
                }
            );
        });

        /**
         * Filter from Group -> Role -> Resource
         */
        let securityResourceFiltered: SecurityResource[] = [];
        securityRoleResourceFiltered.forEach((srrf: SecurityRoleResource) => {
            resourcesMasterList.forEach((rml: SecurityResource) => {
                if (
                    srrf.SECURITY_RESOURCE_UUID === rml.SECURITY_RESOURCE_UUID
                ) {
                    securityResourceFiltered.push(rml);
                }
            });
        });
        dispatch(setFilteredRolesList(securityRolesFiltered));
        dispatch(setFilteredResourceList(securityResourceFiltered));
        dispatch(selectedGroupHandler(option));
    };

    const updateGroupName = () => {};

    const updateGroupDesc = () => {};

    return (
        <PageWrapper>
            <Box
                style={{
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
                }}
            >
                <Autocomplete
                    size="small"
                    sx={{ width: 300 }}
                    options={groupsMasterList}
                    getOptionLabel={(option: any) => option.GROUP_NAME}
                    renderInput={(params) => (
                        <TextField {...params} label="Groups" margin="normal" />
                    )}
                    onChange={(e, option: any) => changeGroup(option)}
                    renderOption={(props, option, { inputValue }) => {
                        const matches = match(option.GROUP_NAME, inputValue);
                        const parts = parse(option.GROUP_NAME, matches);

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
            <Divider
                orientation="horizontal"
                style={{ marginTop: 20, marginBottom: 20 }}
            />
            <Box style={{ width: "100%", display: "flex", height: 200 }}>
                {selectedGroup ? (
                    <>
                        <Box style={{ width: "40%" }}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Group Name"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ maxWidth: "80%" }}
                                    value={selectedGroup.GROUP_NAME ?? ""}
                                    onChange={updateGroupName}
                                />
                            </Stack>
                        </Box>
                        <Box>
                            <Autocomplete
                                size="small"
                                fullWidth
                                multiple
                                sx={{
                                    maxHeight: 180,
                                    maxWidth: 570,
                                    overflow: "auto",
                                }}
                                value={rolesFilteredList}
                                options={rolesMasterList}
                                getOptionLabel={(option: any) =>
                                    option.ROLE_NAME
                                }
                                onChange={(e, option: any) =>
                                    roleHandler(option)
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Roles"
                                        margin="normal"
                                    />
                                )}
                                renderOption={(
                                    props,
                                    option,
                                    { inputValue }
                                ) => {
                                    const matches = match(
                                        option.ROLE_NAME,
                                        inputValue
                                    );
                                    const parts = parse(
                                        option.ROLE_DESC,
                                        matches
                                    );

                                    return (
                                        <li {...props}>
                                            <div>
                                                {parts.map(
                                                    (
                                                        part: any,
                                                        index: number
                                                    ) => (
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
                    </>
                ) : (
                    <></>
                )}
            </Box>
            <Divider orientation="horizontal" />
            <SecurityTable
                dataList={resourcesMasterList}
                tableData={resourcesFilteredList}
                name={"RESOURCE_NAME"}
                value={"ACTION_NAME"}
                headerKey={"Resource"}
                headerValue={"Action"}
            />
        </PageWrapper>
    );
};
