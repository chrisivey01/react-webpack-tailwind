import {
    Autocomplete,
    Box,
    Chip,
    Divider,
    Stack,
    TextField,
} from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { SecurityAction } from "../../../types/SecurityAction";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityGroupRole } from "../../../types/SecurityGroupRole";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import * as JSON from "../../assets/json";
import { groupState, useGroups } from "../../recoil/atoms/groups";
import { PageWrapper } from "../styles";
import { SecurityTable } from "../Table/SecurityTable";

export const Groups = () => {
    const groups = useRecoilValue(groupState);
    const setGroups = useGroups();

    useEffect(() => {
        setGroups((state) => ({
            ...state,
            groupsRoleMasterList: JSON.securityGroupRoleJson,
            groupsMasterList: JSON.securityGroupJson,
            rolesMasterList: JSON.securityRoleJson,
            resourcesMasterList: JSON.securityResourceJson,
            securityRoleResourcesMasterList: JSON.securityRoleResourceJson,
        }));
    }, []);

    const changeGroup = (option: SecurityGroup) => {
        if (option) {
            let securityGroupRoleSelected: SecurityGroupRole[] = [];

            /**
             * Off selected group, filter from master group list to get be prepared
             * to filter off all of the resources.
             */
            groups.groupsRoleMasterList.forEach((sgr: SecurityGroupRole) => {
                if (sgr.SECURITY_GROUP_UUID === option.SECURITY_GROUP_UUID) {
                    securityGroupRoleSelected.push(sgr);
                }
            });

            let securityRoleResourceFiltered: SecurityRoleResource[] = [];

            securityGroupRoleSelected.forEach((sgr: SecurityGroupRole) => {
                groups.securityRoleResourcesMasterList.forEach(
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
            groups.rolesMasterList.forEach((rml: SecurityRole) => {
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
                    groups.resourcesMasterList.forEach(
                        (rml: SecurityResource) => {
                            if (
                                srrf.SECURITY_RESOURCE_UUID ===
                                rml.SECURITY_RESOURCE_UUID
                            ) {
                                let rmlCopy = Object.assign({}, rml);
                                rmlCopy.SECURITY_ACTION_UUID =
                                    srrf.SECURITY_ACTION_UUID;
                                securityResourceFiltered.push(rmlCopy);
                            }
                        }
                    );
                }
            );

            securityResourceFiltered.map((srr: SecurityResource) => {
                const saIndex = JSON.securityActionJson.findIndex(
                    (sa: SecurityAction) =>
                        srr.SECURITY_ACTION_UUID === sa.SECURITY_ACTION_UUID
                );
                srr.ACTION_NAME = JSON.securityActionJson[saIndex].ACTION_NAME;
                srr.COLOR = "black";
                return srr;
            });

            setGroups((state) => ({
                ...state,
                rolesFilteredList: securityRolesFiltered,
                resourcesFilteredList: securityResourceFiltered,
                selectedGroup: option,
            }));
        }
    };

    const roleHandler = (option: SecurityRole[]) => {
        let securityRoleResourceFiltered: SecurityRoleResource[] = [];

        option.forEach((sr: SecurityRole) => {
            groups.securityRoleResourcesMasterList.forEach(
                (srrml: SecurityRoleResource) => {
                    const indexSearch = securityRoleResourceFiltered.findIndex(
                        (srrf: SecurityRoleResource) =>
                            srrf.SECURITY_ROLE_UUID === sr.SECURITY_ROLE_UUID
                    );
                    if (
                        indexSearch === -1 &&
                        srrml.SECURITY_ROLE_UUID === sr.SECURITY_ROLE_UUID
                    ) {
                        securityRoleResourceFiltered.push(srrml);
                    }
                }
            );
        });

        // /**
        //  * Filter groups down to roles associated with.
        //  */
        let securityRolesFiltered: SecurityRole[] = [];
        groups.rolesMasterList.forEach((rml: SecurityRole) => {
            securityRoleResourceFiltered.forEach(
                (srrf: SecurityRoleResource) => {
                    if (rml.SECURITY_ROLE_UUID === srrf.SECURITY_ROLE_UUID) {
                        if(groups.rolesFilteredList.length > 0){
                            let objRml = Object.assign({}, rml);
                            objRml.ADDED = true;
                            securityRolesFiltered.push(objRml);
                        } 
                        securityRolesFiltered.push(rml);
                    }
                }
            );
        });

        // /**
        //  * Filter from Group -> Role -> Resource
        //  */


        let securityResourceFiltered: SecurityResource[] = [];
        securityRoleResourceFiltered.forEach((srrf: SecurityRoleResource) => {
            groups.resourcesMasterList.forEach((rml: SecurityResource) => {
                if (
                    srrf.SECURITY_RESOURCE_UUID === rml.SECURITY_RESOURCE_UUID
                ) {

                    securityResourceFiltered.push(rml);
                }
            });
        });

        setGroups((state) => ({
            ...state,
            rolesFilteredList: securityRolesFiltered,
            resourcesFilteredList: securityResourceFiltered,
            rolesSelected: option,
        }));
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
                    options={groups.groupsMasterList}
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
            <Box style={{ width: "100%", display: "flex", height: 225 }}>
                {groups.selectedGroup ? (
                    <>
                        <Box style={{ width: "40%" }}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Group Name"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ maxWidth: "80%", marginTop: 16 }}
                                    value={
                                        groups.selectedGroup.GROUP_NAME ?? ""
                                    }
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
                                    maxHeight: 220,
                                    maxWidth: 570,
                                    overflow: "auto",
                                }}
                                value={groups.rolesFilteredList}
                                options={groups.rolesMasterList}
                                getOptionLabel={(option: any) =>
                                    option.ROLE_NAME
                                }
                                onChange={(e, option: any) =>
                                    roleHandler(option)
                                }
                                renderTags={(value: any, getTagProps: any) =>
                                    value.map(
                                        (option: SecurityRole, index: any) => (
                                            <Chip
                                                variant="outlined"
                                                label={option.ROLE_NAME}
                                                style={{
                                                    fontStyle: option.ADDED
                                                        ? "italic"
                                                        : "normal",
                                                    fontWeight: option.ADDED
                                                        ? 600
                                                        : 100,
                                                }}
                                            />
                                        )
                                    )
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
                                        option.ROLE_NAME,
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
            <Box sx={{ padding: "10px" }}>
                <Divider orientation="horizontal" />
            </Box>
            <SecurityTable
                dataList={groups.resourcesMasterList}
                tableData={groups.resourcesFilteredList}
                name={"RESOURCE_NAME"}
                value={"ACTION_NAME"}
                headerKey={"Resource"}
                headerValue={"Action"}
            />
        </PageWrapper>
    );
};
