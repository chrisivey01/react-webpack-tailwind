import { Autocomplete, Container, Divider, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect, useState } from "react";
import { PhxUser } from "../../../types/PhxUser";
import { SecurityAction } from "../../../types/SecurityAction";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import { SecurityUserGroup } from "../../../types/SecurityUserGroup";
import { SecurityUserRole } from "../../../types/SecurityUserRole";
import phxUsersJson from "../../assets/json/PHX_USER_FILTERED.json";
import securityActionJson from "../../assets/json/SECURITY_ACTION.json";
import securityGroupListJson from "../../assets/json/SECURITY_GROUP.json";
import securityResourceJson from "../../assets/json/SECURITY_RESOURCE.json";
import securityRolesListJson from "../../assets/json/SECURITY_ROLE.json";
import securityRoleResourceJson from "../../assets/json/SECURITY_ROLE_RESOURCE.json";
import securityUserGroupListJson from "../../assets/json/SECURITY_USER_GROUP.json";
import securityUserRoleListJson from "../../assets/json/SECURITY_USER_ROLE.json";
import { SecurityTable } from "../../components/Table/SecurityTable";
import { OptionsWrapper, PageContainer, PageWrapper } from "../styles";
import { GroupRolesContainer, Wrapper } from "./styles";

export const Roles = () => {
    const phxUsers: PhxUser[] = phxUsersJson;
    const [user, setUser] = useState<PhxUser>();
    const [userRoles, setUserRoles] = useState<SecurityRole[]>([]);
    const [userPickedRoles, setUserPickedRoles] = useState<SecurityRole[]>([]);
    const [userGroups, setUserGroups] = useState<SecurityGroup[]>([]);
    const [userPickedGroups, setUserPickedGroups] = useState<SecurityGroup[]>(
        []
    );
    const [createdList, setCreatedList] = useState<any>([]);
    const [securityAction, setSecurityAction] = useState<any>([]);

    const changeUser = (option: PhxUser | null) => {
        console.log(option);
        if (option) {
            setUser(option);
            const empId = option.USER_ID;

            /**
             * User Groups
             */

            const securityUserGroupList: SecurityUserGroup[] =
                securityUserGroupListJson;
            let filteredSecurityGroupList: SecurityUserGroup[] =
                securityUserGroupList.filter(
                    (sec: SecurityUserGroup) => sec.USER_ID === empId
                );
            let securityGroupList: SecurityGroup[] = securityGroupListJson;
            setUserGroups(securityGroupList);
            const displayedGroups: SecurityGroup[] = securityGroupList.filter(
                (sgl: SecurityGroup) => {
                    for (const fsgl of filteredSecurityGroupList) {
                        if (
                            sgl.SECURITY_GROUP_UUID === fsgl.SECURITY_GROUP_UUID
                        ) {
                            return sgl;
                        }
                    }
                }
            );
            setUserPickedGroups(displayedGroups);

            /**
             * User Roles
             */

            const securityUserRolesList: SecurityUserRole[] =
                securityUserRoleListJson;
            let filteredSecurityRolesList: SecurityUserRole[] =
                securityUserRolesList.filter(
                    (sec: SecurityUserRole) => sec.USER_ID === empId
                );
            let securityRolesList: SecurityRole[] = securityRolesListJson;
            setUserRoles(securityRolesList);
            const displayedRoles: SecurityRole[] = securityRolesList.filter(
                (sgl: SecurityRole) => {
                    for (const fsgl of filteredSecurityRolesList) {
                        if (
                            sgl.SECURITY_ROLE_UUID === fsgl.SECURITY_ROLE_UUID
                        ) {
                            return sgl;
                        }
                    }
                }
            );
            setUserPickedRoles(displayedRoles);
        }
    };

    useEffect(() => {
        setSecurityAction(securityActionJson);
    }, []);

    useEffect(() => {
        const securityRoleResource: SecurityRoleResource[] =
            securityRoleResourceJson;
        console.log(userPickedRoles.length);
        let resources: SecurityRoleResource[] = [];
        userPickedRoles.map((ur: SecurityRole) => {
            resources = securityRoleResource.filter(
                (srr: SecurityRoleResource) =>
                    ur.SECURITY_ROLE_UUID === srr.SECURITY_ROLE_UUID
            );
        });

        let editViewAccessResources: any[] = [];
        if (resources) {
            resources.map((res: SecurityRoleResource) => {
                securityAction.map((sa: SecurityAction) => {
                    if (res.SECURITY_ACTION_UUID === sa.SECURITY_ACTION_UUID) {
                        res.ACTION_NAME = sa.ACTION_NAME;
                        securityResourceJson.map((srj: SecurityResource) => {
                            if (
                                res.SECURITY_RESOURCE_UUID ===
                                srj.SECURITY_RESOURCE_UUID
                            ) {
                                res.RESOURCE_NAME = srj.RESOURCE_NAME;
                                editViewAccessResources.push(res);
                            }
                        });
                    }
                });
            });

            setCreatedList(editViewAccessResources);
        }

        console.log(editViewAccessResources);
    }, [user]);

    return (
        <PageWrapper>
            <PageContainer>
                <OptionsWrapper>
                    <Autocomplete
                        size="small"
                        sx={{ width: 300 }}
                        options={phxUsers}
                        getOptionLabel={(option) => option.USER_ID}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Roles"
                                margin="normal"
                            />
                        )}
                        onChange={(e, option) => changeUser(option)}
                        renderOption={(props, option, { inputValue }) => {
                            const matches = match(option.USER_ID, inputValue);
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
                </OptionsWrapper>
            </PageContainer>
            <Divider orientation="horizontal" flexItem />
            <SecurityTable data={createdList} />
        </PageWrapper>
    );
};
