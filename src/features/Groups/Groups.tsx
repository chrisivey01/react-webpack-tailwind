import { Autocomplete, Box, Divider, Stack, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect, useState } from "react";
import { PhxUser } from "../../../types/PhxUser";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityGroupRole } from "../../../types/SecurityGroupRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import phxUsersJson from "../../assets/json/PHX_USER_FILTERED.json";
import securityActionJson from "../../assets/json/SECURITY_ACTION.json";
import securityGroupListJson from "../../assets/json/SECURITY_GROUP.json";
import securityGroupRoleListJson from "../../assets/json/SECURITY_GROUP_ROLE.json";
import securityRoleListJson from "../../assets/json/SECURITY_ROLE.json";
import securityResourceJson from "../../assets/json/SECURITY_RESOURCE.json";
import securityRoleResourceListJson from "../../assets/json/SECURITY_ROLE_RESOURCE.json";

import { SecurityTable } from "../Table/SecurityTable";
import { PageWrapper } from "../styles";
import { SecurityResource } from "../../../types/SecurityResource";

export const Groups = () => {
    const phxUsers: PhxUser[] = phxUsersJson;
    const [groupName, setGroupName] = useState<string>("");
    const [groupDesc, setGroupDesc] = useState<string>("");
    const [securityResource, setSecurityResource] = useState<SecurityResource>(
        []
    );
    const [securityGroup, setSecurityGroup] = useState<SecurityGroup[]>([]);
    const [securityGroupRoleList, setSecurityGroupRoleList] = useState<
        SecurityGroupRole[]
    >([]);
    const [filteredRoleList, setFilteredRoleList] = useState<
        SecurityRole[] | undefined
    >([]);

    useEffect(() => {
        setSecurityGroup(securityGroupListJson);
        setSecurityGroupRoleList(securityGroupRoleListJson);
    }, [securityGroup]);

    const changeGroup = (option: SecurityGroup) => {
        setGroupName(option.GROUP_NAME);
        setGroupDesc("Currently do not have.");
        if (option) {
            console.log(option.SECURITY_GROUP_UUID);
            let filteredRoleList = securityGroupRoleList.filter(
                (srr: SecurityGroupRole) =>
                    srr.SECURITY_GROUP_UUID === option.SECURITY_GROUP_UUID
            );
            let securityRoleList: SecurityRole[] = [];

            filteredRoleList.map((sgr: SecurityGroupRole) => {
                securityRoleListJson.map((srl: SecurityRole) => {
                    if (sgr.SECURITY_ROLE_UUID === srl.SECURITY_ROLE_UUID) {
                        securityRoleList.push(srl);
                    }
                });
            });

            setFilteredRoleList(securityRoleList);

            let securityRoleResourceFiltered: SecurityRoleResource[] = [];

            securityRoleList.map((srl: SecurityRole) => {
                securityRoleResourceListJson.map(
                    (srr: SecurityRoleResource) => {
                        if (srl.SECURITY_ROLE_UUID === srr.SECURITY_ROLE_UUID) {
                            securityRoleResourceFiltered.push(srr);
                        }
                    }
                );
            });
            let filteredResourceList: SecurityResource[] = [];

            securityRoleResourceFiltered.map((srr: SecurityRoleResource) => {
                securityResourceJson.map((sr: SecurityResource) => {
                    if (
                        sr.SECURITY_RESOURCE_UUID === srr.SECURITY_RESOURCE_UUID
                    ) {
                        filteredResourceList.push(sr);
                    }
                });
            });
            setSecurityResource(filteredResourceList);
        }
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
                    options={securityGroup}
                    getOptionLabel={(option) => option.GROUP_NAME}
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
            <Box style={{ width: "100%", display: "flex", height: 120 }}>
                <Box style={{ width: "40%" }}>
                    <Stack spacing={2}>
                        <TextField
                            label="Group Name"
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ maxWidth: "80%" }}
                            value={groupName}
                            onChange={updateGroupName}
                        />
                        <TextField
                            label="Group Description"
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ width: "80%" }}
                            value={groupDesc}
                            onChange={updateGroupDesc}
                        />
                    </Stack>
                </Box>
                <Box style={{ width: "40%" }}>
                    <Autocomplete
                        size="small"
                        fullWidth
                        multiple
                        limitTags={3}
                        style={{ marginLeft: "10%" }}
                        value={filteredRoleList}
                        options={securityRoleListJson}
                        getOptionLabel={(option) => option.ROLE_NAME}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Roles"
                                margin="normal"
                            />
                        )}
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
            </Box>
            <Divider orientation="horizontal" />
            <SecurityTable
                securityResourceList={securityResourceJson}
                data={securityResource}
                name={"RESOURCE_NAME"}
                value={"ACTION_NAME"}
                headerKey={"Resource"}
                headerValue={"Action"}
            />
        </PageWrapper>
    );
};
