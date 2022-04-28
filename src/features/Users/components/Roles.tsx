import { Autocomplete, Box, Chip, TextField } from "@mui/material";
import { useRecoilValue } from "recoil";
import { SecurityUserGroup, SecurityUserRole } from "../../../../types/PhxUser";
import { SecurityGroupRole } from "../../../../types/SecurityGroup";
import { SecurityRoleList } from "../../../../types/SecurityRole";
import { RESOURCE_BY_PRIORITY_REQUEST, SECURITY_ROLE_REQUEST } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { appState } from "../../../atom/app";
import { userState, useUser } from "../atoms/users";

type Props = {};

const Roles = (props: Props) => {
    const setUser = useUser();
    const user = useRecoilValue(userState);
    const app = useRecoilValue(appState);

    const handleChangeRoles = async (option: any) => {
        let roleNames: string[] = [];
        let roleNamesNoGroups: string[] = [];

        let employee = JSON.parse(JSON.stringify(user.selectedUser));

        employee.operationCd = "M";


        roleNames = option.map((role: any) => role.roleName ?? role.securityRole.roleName);
        roleNamesNoGroups = option.map((role: any) => role.roleName ?? role.securityRole.roleName);

        employee.securityUserGroupList.forEach((group: SecurityUserGroup) => {
            group.securityGroup.securityGroupRoleList.forEach((sgr: SecurityGroupRole) => {
                roleNames.push(sgr.securityRole.roleName);
            });
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
        let results = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);
        employee.resourceByPriorityList = results.resourceByPriorityList;

        let acquiredRolesCopy: any = [];
        roleNamesNoGroups.forEach((roles: any) => {
            JSON.parse(JSON.stringify(srlResults.securityRoleList)).forEach((srlSr: any) => {
                if (roles === srlSr.roleName) {
                    acquiredRolesCopy.push(srlSr);
                }
            });
        });

        let employeesRoles: SecurityUserRole[] = [];
        acquiredRolesCopy.forEach((role: any) => {
            let employeeRole: SecurityUserRole = {
                lastUpdUser: app.employee.employeeId,
                securityAppEaiNbr: app.appId,
                added: false,
                changeFlag: "M",
                securityRole: {
                    lastUpdUser: app.employee.employeeId,
                    roleDesc: role.roleDesc,
                    roleName: role.roleName,
                    securityAppEaiNbr: app.appId,
                    securityRoleResourceList: role.securityRoleResourceList,
                    securityRoleUuid: role.securityRoleUuid
                }
            };
            if (user.acquiredRoles && employee.securityUserRoleList) {
                let deleteIndex = employee.securityUserRoleList.findIndex((roleSearch: any) => (roleSearch.securityRole.roleName === role.roleName));
                let roleIndex = user.acquiredRoles.findIndex((roleSearch: any) => roleSearch.securityRole.roleName === role.roleName);

                if (roleIndex > -1) {
                    employeeRole.securityUserRoleUuid = employee.securityUserRoleList[deleteIndex].securityUserRoleUuid ? employee.securityUserRoleList[deleteIndex].securityUserRoleUuid : null;
                    employeeRole.deleted = employee.securityUserRoleList[deleteIndex]?.deleted ? true : false;
                    employeeRole.operationCd = employee.securityUserRoleList[deleteIndex]?.deleted ? "D" : "M";
                    employeeRole.securityAppEaiNbr = app.appId;
                    employeeRole.securityRole = role;
                    employeeRole.added = false;
                    employeeRole.lastUpdUser = app.employee.employeeId;
                } else {
                    employeeRole.securityAppEaiNbr = app.appId;
                    employeeRole.securityRole = role;
                    employeeRole.changeFlag = "I";
                    employeeRole.operationCd = "I";
                    employeeRole.added = true;
                    employeeRole.lastUpdUser = app.employee.employeeId;
                }
            }
            employeesRoles.push(employeeRole);
        });
        employee.securityUserRoleList = employeesRoles;

        setUser((state) => ({
            ...state,
            selectedUser: employee,
            savePending: true
        }));
    };



    const handleDeleteRoles = async (option: any, index: number) => {
        let employee = JSON.parse(JSON.stringify(user.selectedUser));
        let roleNames: any[] = [];

        employee.operationCd = "M";

        employee.securityUserRoleList[index].deleted = !employee.securityUserRoleList[index].deleted;

        if (employee.securityUserRoleList[index].deleted) {
            employee.securityUserRoleList[index].operationCd = "D";
        } else {
            employee.securityUserRoleList[index].operationCd = "M";
        }

        roleNames = employee.securityUserRoleList.filter((role) => !role.deleted);
        roleNames = roleNames.map((role) => role.securityRole.roleName);
        employee.securityUserGroupList.forEach((group: SecurityUserGroup) => {
            group.securityGroup.securityGroupRoleList.forEach((sgr: SecurityGroupRole) => {
                roleNames.push(sgr.securityRole.roleName);
            });
        });

        if (roleNames.length > 0) {
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
            employee.resourceByPriorityList = acquiredResources.resourceByPriorityList;

            setUser((state) => ({
                ...state,
                selectedUser: employee,
                savePending: true
            }));
        } else {
            setUser((state) => ({
                ...state,
                selectedUser: employee,
            }));
        }
    };

    return (
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
                disableClearable={true}
                options={user.rolesMasterList ?? []}
                getOptionLabel={(option: any) => option.roleName ?? option}
                isOptionEqualToValue={(option: any, value: any) => {
                    if (option === undefined || value === undefined) return;

                    if (value.securityRole) {
                        return option.roleName === value.securityRole.roleName;
                    } else {
                        return option.roleName === value.roleName;
                    }
                }}
                renderTags={(value: any, getTagProps: any) =>
                    value.map(
                        (option: any, index: any) => (
                            <Chip
                                key={index}
                                variant="outlined"
                                clickable
                                onDelete={() => handleDeleteRoles(option, index)}
                                label={option.roleName ?? option.securityRole.roleName}
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
                value={user.selectedUser?.securityUserRoleList ?? []}
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
    );
};

export default Roles;