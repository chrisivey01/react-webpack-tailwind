import { Autocomplete, Box, Divider, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { PhxUser, SecurityUserGroup, SecurityUserRole } from "../../../types/PhxUser";
import { SecurityGroupRole } from "../../../types/SecurityGroup";
import { SecurityRole, SecurityRoleList, SecurityRoleResource } from "../../../types/SecurityRole";
import { PHX_USER_LIST_CONTROLLER, PHX_USER_REQUEST, RESOURCE_BY_PRIORITY_REQUEST, SECURITY_GROUP_LIST_REQUEST, SECURITY_GROUP_REQUEST, SECURITY_ROLE_LIST_REQUEST, SECURITY_ROLE_REQUEST } from "../../apis";
import { httpRequestList } from "../../apis/requests";
import { appState } from "../../atom/app";
import { Severity, useNotification } from "../Notification/atom";
import { OptionsWrapper, PageContainer, PageWrapper } from "../styles";
import { userState, useUser } from "./atoms/users";
import { UserTable } from "./Table/UserTable";

export const Users = () => {
    const setUser = useUser();
    const user = useRecoilValue(userState);
    const app = useRecoilValue(appState);
    const setNotification = useNotification();

    useEffect(() => {
        if (app && app.employee) {
            fetchUsersMasterList();
            fetchGroupsMasterList();
            fetchRolesMasterList();
        }
    }, [app.employee]);

    const fetchUsersMasterList = async () => {
        const params = {
            userId: app.employee.employeeId
        };
        const results = await httpRequestList(PHX_USER_LIST_CONTROLLER, params);
        setUser((state) => ({ ...state, employeeMasterList: results.phxUserList }));
    };

    const fetchGroupsMasterList = async () => {
        const params = {
            securityAppEaiNbr: app.appId,
            userId: app.employee.employeeId
        };
        const results = await httpRequestList(SECURITY_GROUP_LIST_REQUEST, params);
        setUser((state) => ({ ...state, groupsMasterList: results.securityGroupList }));
    };

    const fetchRolesMasterList = async () => {
        const params = {
            securityAppEaiNbr: app.appId,
            userId: app.employee.employeeId
        };
        const results = await httpRequestList(SECURITY_ROLE_LIST_REQUEST, params);
        setUser((state) => ({ ...state, rolesMasterList: results.securityRoleList }));
    };

    const changeUser = async (option: PhxUser | null) => {
        if (option) {
            const params = {
                fetchResources: true,
                securityAppEaiNbr: app.appId,
                userIdList: [option.userId]
            };
            const results = await httpRequestList(PHX_USER_REQUEST, params);
            const emp: PhxUser = results.phxUserList[0];

            /**
             * Update roles and groups assigned to each user to use as values within the other autocompletes.
             */
            let acquiredGroups: SecurityUserGroup[] = emp.securityUserGroupList;
            let acquiredRoles: SecurityUserRole[] = emp.securityUserRoleList;
            let acquiredResources: SecurityRoleResource[] = emp.resourceByPriorityList;

            if (acquiredGroups.length === 0 && acquiredRoles.length === 0 && acquiredResources.length === 0) {
                setNotification((state) => ({
                    ...state,
                    show: true,
                    message:
                        "There are no results for this user.",
                    severity: Severity.warning,
                }));
            }
            setUser((state) => ({ ...state, selectedUser: option, acquiredGroups: acquiredGroups, acquiredRoles: acquiredRoles, acquiredResources: acquiredResources }));
        }
    };

    const changeCopyUser = async (option: PhxUser | null) => {
        if (option) {
            const params = {
                fetchResources: true,
                securityAppEaiNbr: app.appId,
                userIdList: [option.userId]
            };
            const results = await httpRequestList(PHX_USER_REQUEST, params);
            const emp: PhxUser = results.phxUserList[0];

            /**
             * Update roles and groups assigned to each user to use as values within the other autocompletes.
             */
            let acquiredGroups: SecurityUserGroup[] = emp.securityUserGroupList;
            let acquiredRoles: SecurityUserRole[] = emp.securityUserRoleList;
            let acquiredResources: SecurityRoleResource[] = emp.resourceByPriorityList;

            if (acquiredGroups.length === 0 && acquiredRoles.length === 0 && acquiredResources.length === 0) {
                setNotification((state) => ({
                    ...state,
                    show: true,
                    message:
                        "There are no results for this user.",
                    severity: Severity.warning,
                }));
            }
            setUser((state) => ({ ...state, copyUser: option, acquiredGroups: acquiredGroups, acquiredRoles: acquiredRoles, acquiredResources: acquiredResources }));
        }
    };

    const handleChangeGroups = async (option: any, value: any) => {
        let groupNames: string[] = [];

        value.forEach((gr: any) => {
            if (gr.groupName) {
                groupNames.push(gr.groupName);
            } else {
                groupNames.push(gr.securityGroup.groupName);
            }
        });

        const params = {
            fetchResources: true,
            groupNameList: groupNames,
            securityAppEaiNbr: app.appId,
            userId: app.employee.employeeId
        };

        let result = await httpRequestList(
            SECURITY_GROUP_REQUEST,
            params
        );

        let results: any;
        if (result) {
            let getResourcePriority = {
                userId: app.employee.employeeId,
                operationCd: "I",
                roleList: result.securityGroupList.map((sgr: SecurityGroupRole) => {
                    let obj = {
                        operationCd: "I",
                        securityAppEaiNbr: app.appId,
                        changeFlag: sgr.changeFlag,
                        securityRoleResourceList: sgr.resourceByPriorityList
                    };
                    return obj;
                })
            };
            results = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);

            try {
                setUser((state) => ({ ...state, acquiredGroups: result.securityGroupList, acquiredResources: results.resourceByPriorityList }));
            } catch (err) {
                setUser((state) => ({ ...state, acquiredGroups: result.securityGroupList, acquiredResources: [] }));
            }
        } else {
            setUser((state) => ({ ...state, acquiredGroups: result.securityGroupList, acquiredResources: [] }));
        }
    };

    const handleChangeRoles = async (option: any, value: any) => {
        let roleNames: string[] = [];

        value.forEach((rn: any) => {
            if (rn.roleName) {
                roleNames.push(rn.roleName);
            } else {
                roleNames.push(rn);
            }
        });

        const params = {
            fetchResources: true,
            roleNameList: roleNames,
            securityAppEaiNbr: app.appId,
        };
        const srlResults: SecurityRoleList = await httpRequestList(
            SECURITY_ROLE_REQUEST,
            params
        );

        let roleSelectedResources: any = srlResults.securityRoleList.map((srr: SecurityRole) => {
            return srr.securityRoleResourceList;
        });
        let resourcesFromRole = roleSelectedResources;
        let getResourcePriority = {
            userId: app.employee.employeeId,
            operationCd: "I",
            roleList: resourcesFromRole.map((sgr: any) => {
                let obj = {
                    operationCd: "I",
                    securityAppEaiNbr: app.appId,
                    changeFlag: sgr.changeFlag,
                    securityRoleResourceList: sgr
                };
                return obj;
            })
        };
        const acquiredResources = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);

        setUser((state) => ({
            ...state,
            acquiredResources: acquiredResources ? acquiredResources.resourceByPriorityList : [],
            acquiredRoles: srlResults.securityRoleList
        }));
    };

    return (
        <PageWrapper>
            <PageContainer>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "10px",
                    }}
                >
                    <Box sx={{ padding: "10px" }}>
                        <Autocomplete
                            size="small"
                            sx={{
                                maxHeight: 120,
                                width: 300,
                                maxWidth: 570,
                                overflow: "auto",
                            }}
                            options={user.employeeMasterList ?? []}
                            getOptionLabel={(option) =>
                                [
                                    option.userId,
                                    " - ",
                                    option.firstName,
                                    option.lastName,
                                ].join(" ")
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Employee Numbers"
                                    margin="normal"
                                />
                            )}
                            onChange={(e, option) => changeUser(option)}
                            renderOption={(
                                props,
                                option,
                                { inputValue }
                            ) => {
                                const matches = match(
                                    [
                                        option.userId,
                                        " - ",
                                        option.firstName,
                                        option.lastName,
                                    ].join(" "),
                                    inputValue
                                );
                                const parts = parse(
                                    [
                                        option.userId,
                                        " - ",
                                        option.firstName,
                                        option.lastName,
                                    ].join(" "),
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
                    <Box sx={{ padding: "10px" }}>
                        <Autocomplete
                            size="small"
                            sx={{
                                maxHeight: 120,
                                width: 300,
                                maxWidth: 570,
                                overflow: "auto",
                            }}
                            options={user.employeeMasterList ?? []}
                            getOptionLabel={(option) =>
                                [
                                    option.userId,
                                    " - ",
                                    option.firstName,
                                    option.lastName,
                                ].join(" ")
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Copy Access From"
                                    margin="normal"
                                />
                            )}
                            onChange={(e, option) => changeCopyUser(option)}
                            renderOption={(
                                props,
                                option,
                                { inputValue }
                            ) => {
                                const matches = match(
                                    [
                                        option.userId,
                                        " - ",
                                        option.firstName,
                                        option.lastName,
                                    ].join(" "),
                                    inputValue
                                );
                                const parts = parse(
                                    [
                                        option.userId,
                                        " - ",
                                        option.firstName,
                                        option.lastName,
                                    ].join(" "),
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
                </Box>

                <OptionsWrapper>
                    <Box sx={{ padding: "10px" }}>
                        <Autocomplete
                            filterSelectedOptions
                            autoHighlight
                            size="small"
                            sx={{
                                maxHeight: 120,
                                width: 570,
                                maxWidth: 570,
                                overflow: "auto",
                            }}
                            multiple
                            id="tags-outlined"
                            options={user.groupsMasterList ?? []}
                            getOptionLabel={(option: any) =>
                                option.groupName ?? option.securityGroup.groupName
                            }
                            isOptionEqualToValue={(option: any, value: any) => {
                                if (option && value) {
                                    if (option.groupName === value) {
                                        return option;
                                    }

                                    if (option.groupName === value.groupName) {
                                        return option;
                                    }

                                    if (option.groupName === (value.groupName ?? value.securityGroup.groupName)) {
                                        return option;
                                    }
                                }
                            }}
                            onChange={handleChangeGroups}
                            value={user.acquiredGroups ?? []}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Groups"
                                    style={{ fontSize: 12 }}
                                    margin="normal"
                                />
                            )}
                        />{" "}
                    </Box>
                    <Box sx={{ padding: "10px" }}>
                        <Autocomplete
                            filterSelectedOptions
                            autoHighlight
                            size="small"
                            sx={{
                                maxHeight: 220,
                                width: 570,
                                maxWidth: 570,
                                overflow: "auto",
                            }}
                            multiple
                            id="tags-outlined"
                            options={user.rolesMasterList ?? []}
                            getOptionLabel={(option: any) => option.roleName ?? option}
                            isOptionEqualToValue={(option: any, value: any) =>
                                option.roleName === value.roleName
                            }
                            onChange={handleChangeRoles}
                            value={user.acquiredRoles ?? []}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="User Roles"
                                    style={{ fontSize: 12 }}
                                    margin="normal"
                                />
                            )}
                        />
                    </Box>
                </OptionsWrapper>
            </PageContainer>
            <Divider orientation="horizontal" flexItem />

            {user.selectedUser && (user.acquiredGroups.length > 0 || user.acquiredRoles.length > 0 || user.acquiredResources.length > 0) ? <UserTable /> : <></>}
        </PageWrapper>
    );

};
