import { Autocomplete, Box, Divider, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { PhxUser } from "../../../types/PhxUser";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityGroupRole } from "../../../types/SecurityGroupRole";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import { SecurityUserGroup } from "../../../types/SecurityUserGroup";
import * as JSON from "../../assets/json";
import { userState, useUser } from "../../recoil/atoms/users";
import { OptionsWrapper, PageContainer, PageWrapper } from "../styles";
import { SecurityTable } from "../Table/SecurityTable";

export const Users = () => {
    const setUser = useUser();
    const user = useRecoilValue(userState);

    useEffect(() => {
        setUser((state) => ({
            ...state,
            employeeMasterList: JSON.phxUserFilteredJson,
            securityGroupMasterList: JSON.securityGroupJson,
            securityGroupRoleMasterList: JSON.securityGroupRoleJson,
            securityUserGroupMasterList: JSON.securityUserGroupJson,
            securityRolesMasterList: JSON.securityRoleJson,
            securityUserRoleMasterList: JSON.securityUserRoleJson,
            rolesMasterList: JSON.securityRoleJson,
            resourcesMasterList: JSON.securityResourceJson,
            securityActionMasterList: JSON.securityActionJson,
            securityRoleResourceMasterList: JSON.securityRoleResourceJson,
        }));
    }, []);

    const changeUser = (option: PhxUser | null) => {
        if (option) {
            const empId = option.USER_ID;

            /**
             * User Groups
             */

            let filteredSecurityUserGroupList =
                user.securityUserGroupMasterList.filter(
                    (sec: SecurityUserGroup) => sec.USER_ID === empId
                );

            /**
             * Groups dropdown
             */

            let filteredSecurityGroupList: SecurityGroup[] = [];
            filteredSecurityUserGroupList.forEach((sec: SecurityUserGroup) => {
                user.securityGroupMasterList.forEach((sgm: SecurityGroup) => {
                    if (sec.SECURITY_GROUP_UUID === sgm.SECURITY_GROUP_UUID) {
                        filteredSecurityGroupList.push(sgm);
                    }
                });
            });

            /**
             * Roles dropdown
             */

            let securityGroupRoleList: SecurityGroupRole[] = [];
            filteredSecurityGroupList.forEach((sg: SecurityGroup) => {
                user.securityGroupRoleMasterList.forEach(
                    (sgr: SecurityGroupRole) => {
                        if (
                            sgr.SECURITY_GROUP_UUID === sg.SECURITY_GROUP_UUID
                        ) {
                            securityGroupRoleList.push(sgr);
                        }
                    }
                );
            });

            let filteredRoleList: SecurityRole[] = [];
            securityGroupRoleList.forEach((sgrl: SecurityGroupRole) => {
                user.rolesMasterList.forEach((rml: SecurityRole) => {
                    if (rml.SECURITY_ROLE_UUID === sgrl.SECURITY_ROLE_UUID) {
                        filteredRoleList.push(rml);
                    }
                });
            });

            /**
             * Resources table
             */
            let filteredResources: SecurityResource[] = [];
            let selectedRoleResources: SecurityRoleResource[] = [];
            user.securityRoleResourceMasterList.forEach(
                (sr: SecurityRoleResource) => {
                    filteredRoleList.forEach((frl: SecurityRole) => {
                        if (sr.SECURITY_ROLE_UUID === frl.SECURITY_ROLE_UUID) {
                            selectedRoleResources.push(sr);
                        }
                    });
                }
            );

            selectedRoleResources.forEach((srr: SecurityRoleResource) => {
                user.resourcesMasterList.forEach((sr: SecurityResource) => {
                    if (
                        sr.SECURITY_RESOURCE_UUID === srr.SECURITY_RESOURCE_UUID
                    ) {
                        filteredResources.push(sr);
                    }
                });
            });

            setUser((state) => ({
                ...state,
                employee: option,
                groups: filteredSecurityGroupList,
                roles: filteredRoleList,
                resources: filteredResources,
            }));
        }
    };

    if (
        user.employeeMasterList &&
        user.employeeMasterList.length > 0 &&
        user.securityGroupMasterList &&
        user.securityGroupMasterList.length > 0
    ) {
        return (
            <PageWrapper>
                <PageContainer>
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Autocomplete
                            size="small"
                            sx={{ width: 300 }}
                            options={user.employeeMasterList}
                            getOptionLabel={(option) => option.USER_ID}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Employee Numbers"
                                    margin="normal"
                                />
                            )}
                            onChange={(e, option) => changeUser(option)}
                            renderOption={(props, option, { inputValue }) => {
                                const matches = match(
                                    option.USER_ID,
                                    inputValue
                                );
                                const parts = parse(option.USER_ID, matches);

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

                        <Autocomplete
                            size="small"
                            sx={{ width: 300 }}
                            options={user.employeeMasterList}
                            getOptionLabel={(option) => option.USER_ID}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Copy Access From"
                                    margin="normal"
                                />
                            )}
                            onChange={(e, option) => changeUser(option)}
                            renderOption={(props, option, { inputValue }) => {
                                const matches = match(
                                    option.USER_ID,
                                    inputValue
                                );
                                const parts = parse(option.USER_ID, matches);

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

                    <OptionsWrapper>
                        <Autocomplete
                            size="small"
                            sx={{ width: 500 }}
                            multiple
                            id="tags-outlined"
                            options={user.securityGroupMasterList}
                            getOptionLabel={(option: any) => option.GROUP_NAME}
                            filterSelectedOptions
                            value={user.groups ?? []}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Groups"
                                    style={{ fontSize: 12 }}
                                    margin="normal"
                                />
                            )}
                        />{" "}
                        <Autocomplete
                            size="small"
                            sx={{ width: 500 }}
                            multiple
                            id="tags-outlined"
                            options={user.rolesMasterList}
                            getOptionLabel={(option) => option.ROLE_NAME}
                            filterSelectedOptions
                            value={user.roles ?? []}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="User Roles"
                                    style={{ fontSize: 12 }}
                                    margin="normal"
                                />
                            )}
                        />
                    </OptionsWrapper>
                </PageContainer>
                <Divider orientation="horizontal" flexItem />
                <SecurityTable
                    dataList={JSON.securityResourceJson}
                    tableData={user.resources}
                    name={"RESOURCE_NAME"}
                    value={"ACTION_NAME"}
                    headerKey={"Resource"}
                    headerValue={"Action"}
                />
            </PageWrapper>
        );
    } else {
        return <></>;
    }
};
