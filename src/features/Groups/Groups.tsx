import {
    Autocomplete,
    Box,
    Chip,
    Divider,
    Stack,
    TextField
} from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
    SecurityGroup,
    SecurityGroupList,
    SecurityGroupRole
} from "../../../types/SecurityGroup";
import { SecurityRole, SecurityRoleList } from "../../../types/SecurityRole";
import {
    RESOURCE_BY_PRIORITY_REQUEST,
    SECURITY_GROUP_LIST_REQUEST,
    SECURITY_GROUP_REQUEST,
    SECURITY_ROLE_REQUEST
} from "../../apis";
import { httpRequestList } from "../../apis/requests";
import { appState } from "../../atom/app";
import { PageWrapper } from "../styles";
import { groupState, useGroups } from "./atoms/groups";
import GroupTable from "./Table/GroupTable";

export const Groups = () => {
    const app = useRecoilValue(appState);
    const groups = useRecoilValue(groupState);
    const setGroups = useGroups();

    useEffect(() => {
        fetchGroupMasterList();
        fetchRolesMasterList();
    }, [app.appId]);

    const fetchGroupMasterList = async () => {
        const params = {
            securityAppEaiNbr: app.appId,
        };

        const results: SecurityGroupList = await httpRequestList(
            SECURITY_GROUP_LIST_REQUEST,
            params
        );

        if (results) {
            setGroups((state) => ({
                ...state,
                groupsMasterList: results.securityGroupList,
            }));
        }
    };
    const fetchRolesMasterList = async () => {
        const params = {
            fetchResources: true,
            securityAppEaiNbr: app.appId,
        };
        const result: SecurityRoleList = await httpRequestList(
            SECURITY_ROLE_REQUEST,
            params
        );
        if (result) {
            setGroups((state) => ({
                ...state,
                rolesMasterList: result.securityRoleList,
            }));
        }
    };

    const changeGroup = async (option: SecurityGroup) => {
        if (option === null) return;
        const groupName = option.groupName;
        const params = {
            fetchResources: true,
            groupNameList: [groupName],
            securityAppEaiNbr: app.appId,
        };
        const result: SecurityGroupList = await httpRequestList(
            SECURITY_GROUP_REQUEST,
            params
        );

        if (result) {
            setGroups((state) => ({
                ...state,
                selectedGroup: result.securityGroupList[0],
            }));
        }
    };

    const roleHandler = async (option: any) => {
        let selectedGroupCopy = JSON.parse(JSON.stringify(groups.selectedGroup));

        selectedGroupCopy.userId = app.employee.employeeId;

        /**
         * Need to filter rolesMasterList that's cached in recoil to get the securityRoleResourceList to
         * support each role that is being added to the group.
         */
        let groupRole = groups.rolesMasterList.filter((sr: SecurityRole) =>
            sr.securityRoleUuid === option[option.length - 1].securityRoleUuid
        );

        /**
         * Update Security Role for display on table.
         */
        let obj = {
            securityAppEaiNbr: app.appId,
            added: true,
            operationCd: "I",
            securityRole: {
                roleDesc: option[option.length - 1].roleDesc,
                roleName: option[option.length - 1].roleName,
                operationCd: "I",
                securityAppEaiNbr: app.appId,
                securityRoleUuid: option[option.length - 1].securityRoleUuid,
                securityRoleResourceList: groupRole[0].securityRoleResourceList,
            }
        };

        selectedGroupCopy.securityGroupRoleList.push(obj);
        let getResourcePriority = {
            userId: app.employee.employeeId,
            operationCd: "I",
            roleList: selectedGroupCopy.securityGroupRoleList.map((sgr: SecurityGroupRole) => {
                let obj = {
                    operationCd: "I",
                    roleName: sgr.securityRole.roleName,
                    roleDesc: sgr.securityRole.roleDesc,
                    securityAppEaiNbr: app.appId,
                    securityRoleUuid: sgr.securityRole.securityRoleUuid,
                    changeFlag: sgr.securityRole.changeFlag,
                    securityRoleResourceList: sgr.securityRole.securityRoleResourceList
                };
                return obj;
            })
        };
        const results = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);

        /**
         * Update resource list by filtering from service filter.
         */
        selectedGroupCopy.operationCd = "M";
        selectedGroupCopy.resourceByPriorityList = results.resourceByPriorityList;
        setGroups((state) => ({
            ...state,
            selectedGroup: selectedGroupCopy
        }));
    };

    const handleDelete = async (option: any, index: number) => {
        let selectedGroupCopy = JSON.parse(JSON.stringify(groups.selectedGroup));
        selectedGroupCopy.securityGroupRoleList[index].operationCd = "D";
        selectedGroupCopy.operationCd = "M";
        let getResourcePriority = {
            userId: app.employee.employeeId,
            roleList: selectedGroupCopy.securityGroupRoleList.map((sgr: SecurityGroupRole) => {
                let obj = {
                    operationCd: "D",
                    roleName: sgr.securityRole.roleName,
                    roleDesc: sgr.securityRole.roleDesc,
                    securityAppEaiNbr: app.appId,
                    securityRoleUuid: sgr.securityRole.securityRoleUuid,
                    changeFlag: sgr.securityRole.changeFlag,
                    securityRoleResourceList: sgr.securityRole.securityRoleResourceList,
                };
                return obj;
            })
        };
        const results = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);
        // selectedGroupCopy.securityGroupRoleList.splice(index, 1);

        /**
         * Update resource list by filtering from service filter.
         */
        selectedGroupCopy.resourceByPriorityList = results.resourceByPriorityList;
        setGroups((state) => ({
            ...state,
            selectedGroup: selectedGroupCopy
        }));
    };
    const updateGroupName = () => { };

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
                    options={groups.groupsMasterList}
                    getOptionLabel={(option: any) => option.groupName}
                    renderInput={(params) => (
                        <TextField {...params} label="Groups" margin="normal" />
                    )}
                    onChange={(e, option: any) => changeGroup(option)}
                    renderOption={(props, option, { inputValue }) => {
                        const matches = match(option.groupName, inputValue);
                        const parts = parse(option.groupName, matches);

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
            <Box style={{ width: "100%", display: "flex", height: 225 }}>
                {groups.selectedGroup ? (
                    <>
                        <Box style={{ width: "40%" }}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Group Name"
                                    size="small"
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ maxWidth: "80%", marginTop: 16 }}
                                    value={groups.selectedGroup.groupName ?? ""}
                                    onChange={updateGroupName}
                                />
                            </Stack>
                        </Box>
                        <Box>
                            <Autocomplete
                                size="small"
                                fullWidth
                                multiple
                                sx={{
                                    maxHeight: 220,
                                    maxWidth: 570,
                                    overflow: "auto",
                                }}
                                value={groups.selectedGroup.securityGroupRoleList.filter((sgr: SecurityGroupRole) => sgr.operationCd !== "D")}
                                options={groups.rolesMasterList}
                                getOptionLabel={(option: any) =>
                                    option.roleName ?? option.securityRole.roleName
                                }
                                isOptionEqualToValue={(option: any, value: any) =>
                                    option.roleName === value.securityRole.roleName
                                }
                                onChange={(e, option: any) =>
                                    roleHandler(option)
                                }
                                renderTags={(value: any, getTagProps: any) =>
                                    value.map(
                                        (option: SecurityGroupRole, index: any) => (
                                            <Chip
                                                key={index}
                                                variant="outlined"
                                                clickable
                                                onDelete={() => handleDelete(option, index)}
                                                label={option.securityRole.roleName}
                                                style={{
                                                    margin: "2px",
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
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Roles"
                                        margin="normal"
                                    />
                                )}
                                renderOption={(
                                    props,
                                    option,
                                    { inputValue }
                                ) => {
                                    const matches = match(
                                        option.roleName,
                                        inputValue
                                    );
                                    const parts = parse(
                                        option.roleName,
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
                    </>
                ) : (
                    <></>
                )}
            </Box>

            <Divider
                orientation="horizontal"
                flexItem
                style={{ paddingBottom: "5px" }}
            />
            {groups.selectedGroup ? <GroupTable /> : <></>}
        </PageWrapper>
    );
};
