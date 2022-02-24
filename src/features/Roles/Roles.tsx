import { Autocomplete, Box, Divider } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SecurityAction } from "../../../types/SecurityAction";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import * as JSON from "../../assets/json";
import { SecurityTable } from "../Table/SecurityTable";
import { PageContainer, PageWrapper } from "../styles";
import {
    setFilteredResourceList,
    setResourcesMasterList,
    setRolesMasterList,
    setSelectedRole,
} from "./roles-slice";
import { RoleDescField, RoleField } from "./styles";

export const Roles = () => {
    const dispatch = useDispatch();
    const rolesSelected = useSelector((state: any) => state.roles.rolesSelected);
    const filteredResourceList = useSelector(
        (state: any) => state.roles.filteredResourceList
    );
    const rolesMasterList = useSelector(
        (state: any) => state.roles.rolesMasterList
    );

    useEffect(() => {
        dispatch(setRolesMasterList(JSON.securityRoleJson));
        dispatch(setResourcesMasterList(JSON.securityResourceJson));
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
        /**
         * Compares the two lists off the SECURITY_RESOURCE_UUID which
         * will return the SECURITY_ACTION_UUID which needs to be filtered off
         * SECURITY_ACTION.json
         */
        let copySecurityResourceList = JSON.securityResourceJson;
        filteredSecurityRoleResourceList.map((fsrrl: SecurityRoleResource) => {
            copySecurityResourceList.map((srl: SecurityResource) => {
                if (
                    srl.SECURITY_RESOURCE_UUID === fsrrl.SECURITY_RESOURCE_UUID
                ) {
                    let copySrl = Object.assign({}, srl)
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
            srr.COLOR = "white";
            return srr;
        });
        dispatch(setFilteredResourceList(securityResourceFilteredList));
        dispatch(setSelectedRole(option));
    };

    return (
        <PageWrapper>
            <PageContainer>
                <Box style={{ width: "50%", padding: 10 }}>
                    <Autocomplete
                        size="small"
                        fullWidth
                        options={rolesMasterList}
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
                <Divider orientation="vertical" flexItem light />

                <Box style={{ width: "50%", padding: 10 }}>
                    {rolesSelected.ROLE_NAME !== "" ? (
                        <>
                            <RoleField
                                label="Role Name"
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={rolesSelected.ROLE_NAME ?? ""}
                                onChange={handleChange}
                            />
                            <RoleDescField
                                label="Role Description"
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={rolesSelected.ROLE_DESC ?? ""}
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
                securityResourceList={JSON.securityResourceJson}
                tableData={filteredResourceList}
                name={"RESOURCE_NAME"}
                value={"ACTION_NAME"}
                headerKey={"Resource"}
                headerValue={"Action"}
            />
        </PageWrapper>
    );
};
