import { Autocomplete, Box, Chip, Divider, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { PhxUser, SecurityUserGroup, SecurityUserRole, SecurityRole, SecurityGroup } from "../../../types/PhxUser";
import { SecurityGroupRole } from "../../../types/SecurityGroup";
import { SecurityRoleList, SecurityRoleResource } from "../../../types/SecurityRole";
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
                userId: app.employee.employeeId,
                userIdList: [option.userId]
            };
            const results = await httpRequestList(PHX_USER_REQUEST, params);
            const emp: PhxUser = JSON.parse(JSON.stringify(results.phxUserList[0]));

            /**
             * Update roles and groups assigned to each user to use as values within the other autocompletes.
             */
            let acquiredGroups: SecurityGroup[] = [];
            let acquiredRoles: SecurityRole[] = [];
            let groupObj: any[] = [];
            let roleObj: any[] = [];
            let acquiredResources: SecurityRoleResource[] = [];
            if (emp.securityUserGroupList && emp.resourceByPriorityList) {
                emp.securityUserGroupList.forEach((sug: SecurityUserGroup) => {
                    groupObj.push({
                        groupName: sug.securityGroup.groupName,
                        added: false
                    });
                    acquiredGroups?.push(sug.securityGroup);
                    sug.securityGroup.securityGroupRoleList.forEach((sugr: SecurityGroupRole) => {
                        roleObj.push({
                            roleName: sugr.securityRole.roleName,
                            added: false
                        });
                        acquiredRoles.push(sugr.securityRole);
                    });
                });
                acquiredResources = emp.resourceByPriorityList.map((res: any) => {
                    res.added = false;
                    return res;
                });
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
                userIdList: [option.userId]
            };
            const results = await httpRequestList(PHX_USER_REQUEST, params);
            const emp: PhxUser = results.phxUserList[0];

            /**
             * Update roles and groups assigned to each user to use as values within the other autocompletes.
             */
            let acquiredGroups: SecurityGroup[] = [];
            let acquiredRoles: SecurityRole[] = [];
            let groupObj: any[] = [];
            let roleObj: any[] = [];

            let acquiredResources: SecurityRoleResource[] = [];
            if (emp.securityUserGroupList && emp.resourceByPriorityList) {
                emp.securityUserGroupList.forEach((sug: SecurityUserGroup) => {
                    groupObj.push({
                        securityGroup: sug.securityGroup.groupName,
                        added: true
                    });
                    acquiredGroups?.push(sug.securityGroup);
                    sug.securityGroup.securityGroupRoleList.forEach((sugr: SecurityGroupRole) => {
                        roleObj.push({
                            roleName: sugr.securityRole.roleName,
                            added: true
                        });
                        acquiredRoles.push(sugr.securityRole);
                    });
                });
                acquiredResources = emp.resourceByPriorityList;
            }

            if (acquiredGroups && acquiredRoles && acquiredResources) {
                let totalListCount = acquiredGroups.length + acquiredRoles.length + acquiredResources.length;
                if (totalListCount > 0) {
                    setUser((state) => ({
                        ...state,
                        copyUser: option,
                        acquiredGroups: acquiredGroups,
                        acquiredRoles: acquiredRoles,
                        acquiredResources: acquiredResources
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
            setUser((state) => ({ ...state, copyUser: null, acquiredGroups: [], acquiredRoles: [], acquiredResources: [] }));
        }
    };

    const handleChangeGroups = async (option: any) => {
        let employee = JSON.parse(JSON.stringify(user.selectedUser));
        let groupNames: string[] = [];

        option.forEach((gr: any) => {
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
                roleList: result.securityGroupList.map((sgr: SecurityGroup) => {
                    let obj = {
                        operationCd: "I",
                        securityAppEaiNbr: app.appId,
                        userId: app.employee.employeeId,
                        securityRoleResourceList: sgr.resourceByPriorityList
                    };
                    return obj;
                })
            };
            results = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);

            /**
             * added
             * groupName
             */
            let acquiredGroupsCopy = JSON.parse(JSON.stringify(result.securityGroupList));

            employee.operationCd = "M";
            employee.securityUserGroupList = acquiredGroupsCopy.map((sug: SecurityGroup) => {
                let grpIndex = user.groupObj.findIndex((grpSearch: any) => grpSearch.groupName === sug.groupName);
                if (grpIndex !== -1) {
                    return {
                        securityAppEaiNbr: app.appId,
                        securityGroup: sug,
                        added: false
                    };
                } else {
                    return {
                        securityAppEaiNbr: app.appId,
                        securityGroup: sug,
                        changeFlag: "I",
                        operationCd: "I",
                        added: true
                    };
                }
            });
            employee.securityUserRoleList = JSON.parse(JSON.stringify(user.acquiredRoles));

            try {
                setUser((state) => ({
                    ...state,
                    selectedUser: employee,
                    acquiredGroups: employee.securityUserGroupList,
                    acquiredResources: results.resourceByPriorityList
                }));
            } catch (err) {
                setUser((state) => ({ ...state, acquiredGroups: result.securityGroupList, acquiredResources: [] }));
            }
        } else {
            setUser((state) => ({ ...state, acquiredGroups: result.securityGroupList, acquiredResources: [] }));
        }
    };

    const handleChangeRoles = async (option: any) => {
        let roleNames: string[] = [];
        option.forEach((rn: any) => {
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
            userId: app.employee.employeeId
        };

        const srlResults: SecurityRoleList = await httpRequestList(
            SECURITY_ROLE_REQUEST,
            params
        );

        let getResourcePriority = {
            userId: app.employee.employeeId,
            operationCd: "I",
            roleList: srlResults.securityRoleList
        };
        const acquiredResources = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);


        /**
         * added
         * groupName
         */
        let copyAcquiredRoles = JSON.parse(JSON.stringify(srlResults.securityRoleList));
        copyAcquiredRoles.map((role: SecurityRole) => {
            let roleIndex = user.roleObj.findIndex((roleSearch: any) => (roleSearch.roleName === role.roleName));
            if (roleIndex !== -1) {
                role.added = false;
            } else {
                role.added = true;
            }
            return role;
        });

        setUser((state) => ({
            ...state,
            acquiredResources: acquiredResources ? acquiredResources.resourceByPriorityList : [],
            acquiredRoles: copyAcquiredRoles
        }));
    };

    const handleDelete = async (option: any, index: number, groupsOrRoles: string) => {
        let employee = JSON.parse(JSON.stringify(user.selectedUser));
        let acquiredRolesCopy: any[] = JSON.parse(JSON.stringify(user.acquiredRoles));
        let acquiredGroupsCopy = JSON.parse(JSON.stringify(user.acquiredGroups));

        let groupNames: any[] = [];

        acquiredGroupsCopy.forEach((gr: any) => {
            if (gr.groupName || gr.securityGroup.groupName) {
                groupNames.push({
                    groupName: gr.groupName ?? gr.securityGroup.groupName,
                    deleted: false
                });
            }
        });

        groupNames[index].deleted = !groupNames[index].deleted

        groupNames = groupNames.map((gr:any) => {
            if(gr.deleted){
                return gr.groupName
            }
        })

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

        if (groupsOrRoles === "groups") {
            let getResourcePriority = {
                userId: app.employee.employeeId,
                roleList: result.securityGroupList.map((sgr: SecurityGroup) => {
                    let obj = {
                        operationCd: "I",
                        securityAppEaiNbr: app.appId,
                        userId: app.employee.employeeId,
                        securityRoleResourceList: sgr.resourceByPriorityList
                    };
                    return obj;
                })
            };
            let results = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);


            employee.operationCd = "M";
            employee.securityUserGroupList[index].deleted = !employee.securityUserGroupList[index].deleted;
            if (employee.securityUserGroupList[index].deleted) {
                employee.securityUserGroupList[index].operationCd = "D";
                employee.securityUserGroupList[index].changeFlag = "D";
            } else {
                employee.securityUserGroupList[index].operationCd = "M";
                employee.securityUserGroupList[index].changeFlag = "M";
            }
            employee.securityUserRoleList = JSON.parse(JSON.stringify(user.acquiredRoles));

            setUser((state) => ({
                ...state,
                selectedUser: employee,
                acquiredGroups: employee.securityUserGroupList,
                acquiredResources: results.resourceByPriorityList
            }));


        } else {
            acquiredRolesCopy = JSON.parse(JSON.stringify(user.acquiredRoles));
            acquiredRolesCopy[index].deleted = !acquiredRolesCopy[index].deleted;

            if (acquiredRolesCopy[index].deleted) {
                acquiredRolesCopy[index].operationCd = "D";
            } else {
                acquiredRolesCopy[index].operationCd = "M";
            }

            setUser((state) => ({
                ...state,
                acquiredRoles: acquiredRolesCopy
            }));
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
                    <Box sx={{ padding: "10px" }}>
                        <Autocomplete
                            filterSelectedOptions
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
                            renderTags={(value: any, getTagProps: any) =>
                                value.map(
                                    (option: any, index: any) => (
                                        <Chip
                                            key={index}
                                            variant="outlined"
                                            clickable
                                            onDelete={() => handleDelete(option, index, 'groups')}
                                            label={option.groupName ?? option.securityGroup.groupName}
                                            style={{
                                                margin: "2px",
                                                color: option.deleted ? "red" : "unset",
                                                fontStyle: option.added
                                                    ? "italic"
                                                    : "normal",
                                                fontWeight: option.added
                                                    ? 600
                                                    : 100,
                                            }}
                                        />
                                    )
                                )
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
                            onChange={(e, option: any) =>
                                handleChangeGroups(option)
                            }
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
                            renderTags={(value: any, getTagProps: any) =>
                                value.map(
                                    (option: any, index: any) => (
                                        <Chip
                                            key={index}
                                            variant="outlined"
                                            clickable
                                            onDelete={() => handleDelete(option, index, 'roles')}
                                            label={option.roleName}
                                            style={{
                                                margin: "2px",
                                                color: option.deleted ? "red" : "unset",
                                                fontStyle: option.added
                                                    ? "italic"
                                                    : "normal",
                                                fontWeight: option.added
                                                    ? 600
                                                    : 100,
                                            }}
                                        />
                                    )
                                )
                            }
                            onChange={(e, option: any) =>
                                handleChangeRoles(option)
                            }
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

            {user.selectedUser || user.copyUser ? <UserTable /> : <></>}
        </PageWrapper>
    );

};
