import { Autocomplete, Box, Chip, TextField } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { SecurityUserGroup } from "../../../../types/PhxUser";
import { SecurityGroup, SecurityGroupRole } from "../../../../types/SecurityGroup";
import { SecurityRole } from "../../../../types/SecurityRole";
import { RESOURCE_BY_PRIORITY_REQUEST, SECURITY_GROUP_REQUEST } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { appState } from "../../../atom/app";
import { userState, useUser } from "../atoms/users";

const Groups = () => {
    const setUser = useSetRecoilState(userState);
    const user = useRecoilValue(userState);
    const app = useRecoilValue(appState);

    const handleChangeGroups = async (option: any) => {
        let acquiredRoles: SecurityRole[] = [];
        let employee = JSON.parse(JSON.stringify(user.selectedUser));
        let groupNames: string[] = [];

        option.forEach((gr: any) => {
            if (gr.groupName) {
                groupNames.push(gr.groupName);
            } else {
                groupNames.push(gr.securityGroup.groupName);
            }
        });

        if (groupNames) {
            const params = {
                fetchResources: true,
                groupNameList: groupNames,
                securityAppEaiNbr: app.appId,
                userId: app.employee.employeeId
            };

            let resultSecurityGroup = await httpRequestList(
                SECURITY_GROUP_REQUEST,
                params
            );

            let resultResourcePriority: any;
            let getResourcePriority = {
                userId: app.employee.employeeId,
                roleList: resultSecurityGroup.securityGroupList.map((sgr: SecurityGroup) => {
                    let obj = {
                        operationCd: "I",
                        securityAppEaiNbr: app.appId,
                        userId: app.employee.employeeId,
                        securityRoleResourceList: sgr.resourceByPriorityList
                    };
                    return obj;
                })
            };
            resultResourcePriority = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);

            let acquiredGroupsCopy = JSON.parse(JSON.stringify(resultSecurityGroup.securityGroupList));

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

            employee.securityUserGroupList.forEach((sug: SecurityUserGroup) => {
                sug.securityGroup.securityGroupRoleList.forEach((sugr: SecurityGroupRole) => {
                    acquiredRoles.push(sugr.securityRole);
                });
            });
            employee.securityUserRoleList = acquiredRoles;

            try {
                setUser((state) => ({
                    ...state,
                    selectedUser: employee,
                    acquiredGroups: employee.securityUserGroupList,
                    // acquiredRoles: employee.securityUserRoleList,
                    acquiredResources: resultResourcePriority.resourceByPriorityList,
                    savePending: true
                }));
            } catch (err) {
                setUser((state) => ({ ...state, acquiredGroups: resultSecurityGroup.securityGroupList, acquiredResources: [], savePending: true }));
            }
        } else {
            setUser((state) => ({ ...state, acquiredGroups: [], acquiredResources: [], savePending: true }));
        }
    };

    const handleDeleteGroups = async (option: any, index: number) => {
        let employee = JSON.parse(JSON.stringify(user.selectedUser));
        let acquiredGroupsCopy = JSON.parse(JSON.stringify(user.acquiredGroups));

        let groupNames: any[] = [];

        if (acquiredGroupsCopy.length > 0) {
            acquiredGroupsCopy[index].deleted = !acquiredGroupsCopy[index].deleted;
            acquiredGroupsCopy.forEach((gr: any) => {
                if (gr.groupName || gr.securityGroup.groupName) {
                    groupNames.push({
                        groupName: gr.groupName ?? gr.securityGroup.groupName,
                        deleted: gr.deleted
                    });
                }
            });

            const params = {
                fetchResources: true,
                groupNameList: groupNames.filter((grp) => !grp.deleted).map((grp) => grp.groupName),
                securityAppEaiNbr: app.appId,
                userId: app.employee.employeeId
            };

            if (groupNames.filter((grp) => !grp.deleted).length > 0) {

                let result = await httpRequestList(
                    SECURITY_GROUP_REQUEST,
                    params
                );

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

                setUser((state) => ({
                    ...state,
                    selectedUser: employee,
                    acquiredGroups: employee.securityUserGroupList,
                    // acquiredRoles: employee.securityUserRoleList,
                    acquiredResources: results.resourceByPriorityList,
                    savePending: true
                }));
            } else {
                employee.securityUserGroupList[index].deleted = !employee.securityUserGroupList[index].deleted;
                if (employee.securityUserGroupList[index].deleted) {
                    employee.securityUserGroupList[index].operationCd = "D";
                    employee.securityUserGroupList[index].changeFlag = "D";
                } else {
                    employee.securityUserGroupList[index].operationCd = "M";
                    employee.securityUserGroupList[index].changeFlag = "M";
                }
                setUser((state) => ({
                    ...state,
                    selectedUser: employee,
                    acquiredGroups: employee.securityUserGroupList,
                    acquiredResources: [],
                    savePending: true
                }));
            }
        }
    };

    return (
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
                                onDelete={() => handleDeleteGroups(option, index)}
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
                    if (option === undefined || value === undefined) return;

                    if (value.securityGroup) {
                        return option.groupName === value.securityGroup.groupName;
                    } else {
                        return option.groupName === value.groupName;
                    }
                }}
                onChange={(e, option: any) =>
                    handleChangeGroups(option)
                }
                value={user.selectedUser?.securityUserGroupList ?? []}
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
    );
};


export default Groups;