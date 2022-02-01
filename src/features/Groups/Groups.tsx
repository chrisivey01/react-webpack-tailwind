import { Autocomplete, Divider, TextField } from "@mui/material";
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

export const Groups = () => {
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

    const changeUser = (option: SecurityGroup | null) => {
        console.log(option);
        if (option) {
        }
    };

    useEffect(() => {
        setUserGroups(securityGroupListJson);
        setSecurityAction(securityActionJson);
    }, []);

    useEffect(() => {
        console.log(userGroups);
    }, [user]);

    return (
        <PageWrapper>
            <PageContainer>
                <OptionsWrapper
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-around",
                    }}
                >
                    <Autocomplete
                        size="small"
                        sx={{ width: 300 }}
                        options={userGroups}
                        getOptionLabel={(option) => option.GROUP_NAME}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Groups"
                                margin="normal"
                            />
                        )}
                        onChange={(e, option) => changeUser(option)}
                        renderOption={(props, option, { inputValue }) => {
                            const matches = match(
                                option.GROUP_NAME,
                                inputValue
                            );
                            const parts = parse(option.GROUP_NAME, matches);

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
                        sx={{ width: 500 }}
                        multiple
                        id="tags-outlined"
                        options={userRoles}
                        getOptionLabel={(option) => option.ROLE_NAME}
                        filterSelectedOptions
                        value={userPickedRoles}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Roles"
                                style={{ fontSize: 12 }}
                                margin="normal"
                            />
                        )}
                    />
                </OptionsWrapper>
            </PageContainer>
            <Divider orientation="horizontal" flexItem />
            <SecurityTable data={createdList} />
        </PageWrapper>
    );
};
