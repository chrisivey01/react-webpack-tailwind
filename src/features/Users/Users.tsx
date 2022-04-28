import { Autocomplete, Box, Divider, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { PhxUser, SecurityUserGroup, SecurityUserRole } from "../../../types/PhxUser";
import { SecurityGroupRole } from "../../../types/SecurityGroup";
import { SecurityRoleResource } from "../../../types/SecurityRole";
import { PHX_USER_LIST_CONTROLLER, PHX_USER_REQUEST, SECURITY_GROUP_LIST_REQUEST, SECURITY_ROLE_LIST_REQUEST } from "../../apis";
import { httpRequestList } from "../../apis/requests";
import { appState } from "../../atom/app";
import { Severity, useNotification } from "../Notification/atom";
import { OptionsWrapper, PageContainer, PageWrapper } from "../styles";
import { userState } from "./atoms/users";
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

    useEffect(() => {
        if (!user.savePending) {
            changeUser(user.selectedUser);
        }
    }, [user.savePending]);

    const fetchUsersMasterList = async () => {
        const params = {
            userId: app.employee.employeeId
        };
        const results = await httpRequestList(PHX_USER_LIST_CONTROLLER, params);
        setUser((state) => ({ ...state, employeeMasterList: results.phxUserList.sort((a: PhxUser, b: PhxUser) => a.userId - b.userId) }));
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
            setUser((state: any) => ({
                ...state,
                savePending: false
            }));
            const params = {
                fetchResources: true,
                securityAppEaiNbr: app.appId,
                userId: app.employee.employeeId,
                userIdList: [option.userId]
            };
            const results = await httpRequestList(PHX_USER_REQUEST, params);
            let emp: PhxUser = JSON.parse(JSON.stringify(results.phxUserList[0]));

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
                    emp.securityUserGroupList = [];
                    emp.securityUserRoleList = [];
                    emp.resourceByPriorityList = [];
                    setUser((state) => ({ ...state, selectedUser: emp, acquiredGroups: [], acquiredRoles: [], acquiredResources: [], groupObj: [], roleObj: [] }));
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
            const copiedEmp: PhxUser = JSON.parse(JSON.stringify(results.phxUserList[0]));
            const emp: PhxUser = JSON.parse(JSON.stringify(user.selectedUser));
            /**
             * Update roles and groups assigned to each user to use as values within the other autocompletes.
             */
            let acquiredGroups: SecurityUserGroup[] = [];
            let acquiredRoles: SecurityUserRole[] = [];
            let groupObj: any[] = [];
            let roleObj: any[] = [];
            let acquiredResources: SecurityRoleResource[] = [];
            if (copiedEmp.securityUserGroupList && copiedEmp.resourceByPriorityList) {
                copiedEmp.securityUserGroupList.forEach((sug: SecurityUserGroup) => {
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
                    });
                });
                acquiredResources = copiedEmp.resourceByPriorityList.map((res: any) => {
                    res.added = false;
                    return res;
                });

                if (copiedEmp.securityUserRoleList) {
                    acquiredRoles = copiedEmp.securityUserRoleList;
                }
            }

            if (acquiredGroups && acquiredRoles && acquiredResources) {
                let totalListCount = acquiredGroups.length + acquiredRoles.length + acquiredResources.length;
                if (totalListCount > 0 && copiedEmp.securityUserGroupList && copiedEmp.securityUserRoleList && copiedEmp.resourceByPriorityList && user.selectedUser && user.selectedUser.securityUserGroupList && user.selectedUser.securityUserRoleList && user.selectedUser.resourceByPriorityList) {
                    emp.securityUserGroupList = [...user.selectedUser.securityUserGroupList, ...copiedEmp.securityUserGroupList];
                    emp.securityUserRoleList = [...user.selectedUser.securityUserRoleList, ...copiedEmp.securityUserRoleList];
                    emp.resourceByPriorityList = [...user.selectedUser.resourceByPriorityList, ...copiedEmp.resourceByPriorityList];

                    setUser((state: any) => ({
                        ...state,
                        copyUser: copiedEmp,
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

                    // setUser((state) => ({ ...state, selectedUser: null, acquiredGroups: [], acquiredRoles: [], acquiredResources: [] }));
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
                            value={user.selectedUser ?? null}
                            options={user.employeeMasterList ?? []}
                            isOptionEqualToValue={(option: any, value: any) => {
                                if (option.userId === value) {
                                    return option;
                                }
                                if (option.userId === value.userId) {
                                    return option;
                                }
                            }}
                            getOptionLabel={(option) => {
                                if (option) {
                                    return (
                                        [
                                            option.userId,
                                            " - ",
                                            option.firstName,
                                            option.lastName,
                                        ].join(" ")
                                    );
                                } else {
                                    return option;
                                }
                            }}
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
                            disabled={user.selectedUser ? false : true}
                            sx={{
                                maxHeight: 120,
                                width: 300,
                                maxWidth: 570,
                                overflow: "auto",
                            }}
                            value={user.copyUser ?? null}
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

