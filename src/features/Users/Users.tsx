import { Autocomplete, Box, Divider, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { PhxUser, SecurityGroup, SecurityRole, SecurityUserGroup, SecurityUserRole } from "../../../types/PhxUser";
import { SecurityGroupRole } from "../../../types/SecurityGroup";
import { SecurityRoleResource } from "../../../types/SecurityRole";
import { PHX_USER_LIST_CONTROLLER, PHX_USER_REQUEST, SECURITY_GROUP_LIST_REQUEST, SECURITY_ROLE_LIST_REQUEST } from "../../apis";
import { httpRequestList } from "../../apis/requests";
import { appState } from "../../atom/app";
import { Severity, useNotification } from "../Notification/atom";
import { OptionsWrapper, PageContainer, PageWrapper } from "../styles";
import { userState, useUser } from "./atoms/users";
import Groups from "./components/Groups";
import Roles from "./components/Roles";
import { UserTable } from "./Table/UserTable";

export const Users = () => {
    const setUser = useSetRecoilState(userState);
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
                userId: app.employee.employeeId,
                userIdList: [option.userId]
            };
            const results = await httpRequestList(PHX_USER_REQUEST, params);
            const emp: PhxUser = JSON.parse(JSON.stringify(results.phxUserList[0]));

            /**
             * Update roles and groups assigned to each user to use as values within the other autocompletes.
             */
            let acquiredGroups: SecurityUserGroup[] = [];
            let acquiredRoles: SecurityUserRole[] = [];
            let groupObj: any[] = [];
            let roleObj: any[] = [];
            let acquiredResources: SecurityRoleResource[] = [];
            if (emp.securityUserGroupList && emp.resourceByPriorityList) {
                emp.securityUserGroupList.forEach((sug: SecurityUserGroup) => {
                    groupObj.push({
                        groupName: sug.securityGroup.groupName,
                        added: false
                    });
                    acquiredGroups?.push(sug);
                    sug.securityGroup.securityGroupRoleList.forEach((sugr: SecurityGroupRole) => {
                        roleObj.push({
                            roleName: sugr.securityRole.roleName,
                            added: false
                        });
                        // acquiredRoles.push(sugr.securityRole);
                    });
                });
                acquiredResources = emp.resourceByPriorityList.map((res: any) => {
                    res.added = false;
                    return res;
                });

                if (emp.securityUserRoleList) {
                    acquiredRoles = emp.securityUserRoleList;
                }
            }

            if (acquiredGroups && acquiredRoles && acquiredResources) {
                let totalListCount = acquiredGroups.length + acquiredRoles.length + acquiredResources.length;
                if (totalListCount > 0) {
                    setUser((state) => ({
                        ...state,
                        selectedUser: emp,
                        acquiredGroups: acquiredGroups,
                        acquiredRoles: acquiredRoles,
                        acquiredResources: acquiredResources,
                        groupObj: groupObj,
                        roleObj: roleObj
                    }));
                } else {
                    setNotification((state) => ({
                        ...state,
                        show: true,
                        message:
                            "There are no results for this user.",
                        severity: Severity.warning,
                    }));
                }
            }
        } else {
            setUser((state) => ({ ...state, selectedUser: null, acquiredGroups: [], acquiredRoles: [], acquiredResources: [] }));
        }
    };

    const changeCopyUser = async (option: PhxUser | null) => {
        if (option) {
            const params = {
                fetchResources: true,
                securityAppEaiNbr: app.appId,
                userId: app.employee.employeeId,
                userIdList: [option.userId]
            };
            const results = await httpRequestList(PHX_USER_REQUEST, params);
            const emp: PhxUser = JSON.parse(JSON.stringify(results.phxUserList[0]));

            /**
             * Update roles and groups assigned to each user to use as values within the other autocompletes.
             */
            let acquiredGroups: SecurityUserGroup[] = [];
            let acquiredRoles: SecurityUserRole[] = [];
            let groupObj: any[] = [];
            let roleObj: any[] = [];
            let acquiredResources: SecurityRoleResource[] = [];
            if (emp.securityUserGroupList && emp.resourceByPriorityList) {
                emp.securityUserGroupList.forEach((sug: SecurityUserGroup) => {
                    groupObj.push({
                        groupName: sug.securityGroup.groupName,
                        added: false
                    });
                    acquiredGroups?.push(sug);
                    sug.securityGroup.securityGroupRoleList.forEach((sugr: SecurityGroupRole) => {
                        roleObj.push({
                            roleName: sugr.securityRole.roleName,
                            added: false
                        });
                        // acquiredRoles.push(sugr.securityRole);
                    });
                });
                acquiredResources = emp.resourceByPriorityList.map((res: any) => {
                    res.added = false;
                    return res;
                });

                if (emp.securityUserRoleList) {
                    acquiredRoles = emp.securityUserRoleList;
                }
            }

            if (acquiredGroups && acquiredRoles && acquiredResources) {
                let totalListCount = acquiredGroups.length + acquiredRoles.length + acquiredResources.length;
                if (totalListCount > 0) {
                    setUser((state) => ({
                        ...state,
                        selectedUser: emp,
                        acquiredGroups: acquiredGroups,
                        acquiredRoles: acquiredRoles,
                        acquiredResources: acquiredResources,
                        groupObj: groupObj,
                        roleObj: roleObj
                    }));
                } else {
                    setNotification((state) => ({
                        ...state,
                        show: true,
                        message:
                            "There are no results for this user.",
                        severity: Severity.warning,
                    }));
                }
            }
        } else {
            setUser((state) => ({ ...state, selectedUser: null, acquiredGroups: [], acquiredRoles: [], acquiredResources: [] }));
        }
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
                    <Groups />
                    <Roles />
                </OptionsWrapper>
            </PageContainer>
            <Divider orientation="horizontal" flexItem />

            {user.selectedUser || user.copyUser ? <UserTable /> : <></>}
        </PageWrapper>
    );

};
