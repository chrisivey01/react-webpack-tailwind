import { Autocomplete, Box, Divider } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { SecurityAction } from "../../../types/SecurityAction";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import * as JSON from "../../assets/json";
import { rolesState, useRoles } from "../../recoil/atoms/roles";
import { PageContainer, PageWrapper } from "../styles";
import { SecurityTable } from "../Table/SecurityTable";
import { RoleDescField, RoleField } from "./styles";

export const Roles = () => {
    const roles = useRecoilValue(rolesState);
    const setRoles = useRoles();

    useEffect(() => {
        setRoles((state) => ({
            ...state,
            rolesMasterList: JSON.securityRoleJson,
            resourcesMasterList: JSON.securityResourceJson,
        }));
    }, []);

    const handleChange = () => {};

    const changeRole = (option: SecurityRole) => {
        const securityUuid = option.SECURITY_ROLE_UUID;
        let securityRoleResourceList: SecurityRoleResource[] =
            JSON.securityRoleResourceJson;

        let filteredSecurityRoleResourceList = securityRoleResourceList.filter(
            (securityRoleResource: SecurityRoleResource) => {
                return securityRoleResource.SECURITY_ROLE_UUID === securityUuid;
            }
        );

        let securityResourceFilteredList: SecurityResource[] = [];

        let copySecurityResourceList = JSON.securityResourceJson;
        filteredSecurityRoleResourceList.map((fsrrl: SecurityRoleResource) => {
            copySecurityResourceList.map((srl: SecurityResource) => {
                if (
                    srl.SECURITY_RESOURCE_UUID === fsrrl.SECURITY_RESOURCE_UUID
                ) {
                    let copySrl = Object.assign({}, srl);
                    copySrl.SECURITY_ACTION_UUID = fsrrl.SECURITY_ACTION_UUID;
                    securityResourceFilteredList.push(copySrl);
                }
            });
        });

        securityResourceFilteredList.map((srr: SecurityResource) => {
            const saIndex = JSON.securityActionJson.findIndex(
                (sa: SecurityAction) =>
                    srr.SECURITY_ACTION_UUID === sa.SECURITY_ACTION_UUID
            );
            srr.ACTION_NAME = JSON.securityActionJson[saIndex].ACTION_NAME;
            srr.COLOR = "black";
            return srr;
        });
        setRoles((state) => ({
            ...state,
            filteredResourceList: securityResourceFilteredList,
            rolesSelected: [option],
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
                        getOptionLabel={(option: any) => option.ROLE_NAME}
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
                <Divider orientation="vertical" flexItem />

                <Box style={{ width: "50%", padding: 10 }}>
                    {roles.roleSelected &&
                    roles.roleSelected.ROLE_NAME !== "" ? (
                        <>
                            <RoleField
                                label="Role Name"
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={roles.roleSelected.ROLE_NAME ?? ""}
                                onChange={handleChange}
                            />
                            <RoleDescField
                                label="Role Description"
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={roles.roleSelected.ROLE_DESC ?? ""}
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
                dataList={JSON.securityResourceJson}
                tableData={roles.filteredResourceList}
                name={"RESOURCE_NAME"}
                value={"ACTION_NAME"}
                headerKey={"Resource"}
                headerValue={"Action"}
            />
        </PageWrapper>
    );
};
