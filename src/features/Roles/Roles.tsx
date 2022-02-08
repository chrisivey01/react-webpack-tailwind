import { Autocomplete, Box, Divider } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect, useState } from "react";
import { PhxUser } from "../../../types/PhxUser";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import phxUsersJson from "../../assets/json/PHX_USER_FILTERED.json";
import securityResourceJson from "../../assets/json/SECURITY_RESOURCE.json";
import securityRolesListJson from "../../assets/json/SECURITY_ROLE.json";
import securityRoleResourceJson from "../../assets/json/SECURITY_ROLE_RESOURCE.json";
import securityActionListJson from "../../assets/json/SECURITY_ACTION.json";

import { SecurityTable } from "../../components/Table/SecurityTable";
import { PageContainer, PageWrapper } from "../styles";
import { RoleDescField, RoleField } from "./styles";
import { SecurityAction } from "../../../types/SecurityAction";

interface Props {
    checkedState: boolean;
}

export const Roles = ({ checkedState }: Props) => {
    const phxUsers: PhxUser[] = phxUsersJson;
    const [user, setUser] = useState<PhxUser>();
    const [userRoles, setUserRoles] = useState<SecurityRole[]>([]);
    const [resourceFiltered, setResourceFiltered] = useState<
        SecurityResource[]
    >([]);
    const [selectedRole, setSelectedRole] = useState<SecurityRole | undefined>(
        undefined
    );
    const [userPickedRoles, setUserPickedRoles] = useState<SecurityRole[]>([]);
    const [userGroups, setUserGroups] = useState<SecurityGroup[]>([]);
    const [userPickedGroups, setUserPickedGroups] = useState<SecurityGroup[]>(
        []
    );
    const [createdList, setCreatedList] = useState<any>([]);
    const [securityAction, setSecurityAction] = useState<any>([]);

    const changeRole = (option: SecurityRole) => {
        const securityUuid = option.SECURITY_ROLE_UUID;
        let securityRolesList: SecurityRole[] = securityRolesListJson;
        let securityRoleResourceList: SecurityRoleResource[] =
            securityRoleResourceJson;

        let filteredSecurityRoleResourceList = securityRoleResourceList.filter(
            (securityRoleResource: SecurityRoleResource) => {
                return securityRoleResource.SECURITY_ROLE_UUID === securityUuid;
            }
        );

        console.log(filteredSecurityRoleResourceList);

        let securityResourceFilteredList: SecurityResource[] = [];
        /**
         * Compares the two lists off the SECURITY_RESOURCE_UUID which
         * will return the SECURITY_ACTION_UUID which needs to be filtered off
         * SECURITY_ACTION.json
         */
        filteredSecurityRoleResourceList.map((fsrrl: SecurityRoleResource) => {
            securityResourceJson.map((srl: SecurityResource) => {
                if (
                    srl.SECURITY_RESOURCE_UUID === fsrrl.SECURITY_RESOURCE_UUID
                ) {
                    srl.SECURITY_ACTION_UUID = fsrrl.SECURITY_ACTION_UUID;
                    securityResourceFilteredList.push(srl);
                }
            });
        });

        securityResourceFilteredList.map((srr: SecurityResource) => {
            const saIndex = securityActionListJson.findIndex(
                (sa: SecurityAction) =>
                    srr.SECURITY_ACTION_UUID === sa.SECURITY_ACTION_UUID
            );
            srr.ACTION_NAME = securityActionListJson[saIndex].ACTION_NAME;
            return srr;
        });
        setResourceFiltered(securityResourceFilteredList);
        setSelectedRole(option);
    };

    useEffect(() => {
        let securityRolesList: SecurityRole[] = securityRolesListJson;
        setUserRoles(securityRolesList);
    }, []);

    const handleChange = () => {};

    return (
        <PageWrapper>
            <PageContainer>
                <Box style={{ width: "50%", padding: 10 }}>
                    <Autocomplete
                        size="small"
                        fullWidth
                        options={userRoles}
                        getOptionLabel={(option) => option.ROLE_NAME}
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
                            const matches = match(option.ROLE_NAME, inputValue);
                            const parts = parse(option.ROLE_NAME, matches);

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
                <Divider orientation="vertical" flexItem light />

                <Box style={{ width: "50%", padding: 10 }}>
                    {selectedRole ? (
                        <>
                            <RoleField
                                label="Role Name"
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={selectedRole.ROLE_NAME}
                                onChange={handleChange}
                            />
                            <RoleDescField
                                label="Role Description"
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={selectedRole.ROLE_DESC}
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
            <SecurityTable
                data={resourceFiltered}
                name={"RESOURCE_NAME"}
                value={"ACTION_NAME"}
                headerKey={"Resource"}
                headerValue={"Action"}
            />
        </PageWrapper>
    );
};
