
import { Autocomplete, Box, Divider, Grid, TextField } from "@mui/material";
import { useRecoilValue } from "recoil";
import { SecurityGroup, SecurityGroupRole } from "../../../../types/SecurityGroup";
import { RESOURCE_BY_PRIORITY_REQUEST, SECURITY_GROUP_REQUEST } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { appState } from "../../../atom/app";
import { useNotification } from "../../Notification/atom";
import { createGroupState, useCreateGroup } from "../atoms/createGroup";
import { groupState } from "../atoms/groups";
import { CreateRoleButton, CreateRoleFields } from "../styles";


export const GroupPopup = () => {
    const app = useRecoilValue(appState);
    const groups = useRecoilValue(groupState);
    const createGroup = useRecoilValue(createGroupState);
    const setCreateGroup = useCreateGroup();
    const setNotification = useNotification();

    const groupSelectHandler = async (option: any, value: any) => {
        const groupNameList = value.map((va: SecurityGroup) => va.groupName);
        console.log(groupNameList);

        const params = {
            groupNameList: groupNameList,
            securityAppEaiNbr: app.appId,
        };
        let result = {
            securityGroupList: []
        };
        let selectedRoles: SecurityGroupRole[] = [];
        if (value.length > 0) {

            result = await httpRequestList(
                SECURITY_GROUP_REQUEST,
                params
            );

            result.securityGroupList.forEach((sg: SecurityGroup) => {
                selectedRoles = [...selectedRoles, ...sg.securityGroupRoleList];
            });

        } else {
            selectedRoles = [];
        }
        
        setCreateGroup((state) => ({
            ...state,
            selectedGroupStrings: value,
            selectedGroups: result.securityGroupList,
            selectedRoles: selectedRoles
        }));

    };

    const roleSelectHandler = (option: any, rolesList: any) => {
        let resourceObj = Object.assign({}, rolesList[rolesList.length - 1]);
        rolesList[rolesList.length - 1] = resourceObj;
        setCreateGroup((state) => ({ ...state, selectedRoles: rolesList }));
    };

    interface NewGroup {
        userId: string;
        securityGroupList: SecurityGroup[];
    };
    const groupCreateHandler = async () => {
        let saveObj = {
            userId: app.employee.employeeId,
            securityGroupList: [{
                securityAppEaiNbr: app.appId,
                operationCd: "I",
                groupName: createGroup.group.groupName,
                securityGroupRoleList: []
            }]
        } as NewGroup;

        saveObj.securityGroupList[0].securityAppEaiNbr = app.appId;
        saveObj.securityGroupList[0].operationCd = "I";
        if (createGroup.group && createGroup.group.groupName) {
            saveObj.securityGroupList[0].groupName = createGroup.group.groupName;
        }

        saveObj.securityGroupList[0].securityGroupRoleList = JSON.parse(JSON.stringify([...saveObj.securityGroupList[0].securityGroupRoleList, ...createGroup.selectedRoles]));
        saveObj.securityGroupList[0].securityGroupRoleList.map((sgr: SecurityGroupRole) => sgr.operationCd = "I");

        setCreateGroup((state) => ({ ...state, createdPending: true, newGroup: saveObj, show: false }));
    };

    const groupNameHandler = (event: any) => {
        let groupFields = { ...createGroup.group };
        groupFields.groupName = event.target.value;
        setCreateGroup((state) => ({ ...state, group: groupFields }));
    };


    return (
        <>
            <Grid>
                <Box>
                    <CreateRoleFields
                        label={"Group Name"}
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={groupNameHandler}
                    />
                    <CreateRoleFields
                        label={"Group Description"}
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
                <Divider style={{ margin: 10 }} />
                <Box>
                    <Autocomplete
                        size="small"
                        multiple
                        id="tags-outlined"
                        options={groups.groupsMasterList ?? []}
                        onChange={groupSelectHandler}
                        getOptionLabel={(option: any) => option.groupName}
                        value={createGroup.selectedGroupStrings}
                        isOptionEqualToValue={(option: any, value: any) =>
                            option.groupName === value.groupName
                        }
                        filterSelectedOptions
                        autoHighlight
                        autoSelect
                        sx={{ maxHeight: 120, maxWidth: 570, overflow: "auto" }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Select Group to Copy"}
                                style={{ fontSize: 12 }}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />
                    <Autocomplete
                        size="small"
                        multiple
                        id="tags-outlined"
                        options={groups.rolesMasterList}
                        value={createGroup.selectedRoles ?? []}
                        getOptionLabel={(option: any) => option.roleName ?? option.securityRole.roleName}
                        isOptionEqualToValue={(option: any, value: any) =>
                            option.roleName === (value.roleName ?? value.securityRole.roleName)
                        }
                        filterSelectedOptions
                        autoHighlight
                        autoSelect
                        onChange={roleSelectHandler}
                        sx={{
                            height: 305,
                            maxHeight: 305,
                            overflow: "auto",
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Select Roles"}
                                style={{ fontSize: 12 }}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />
                </Box>
            </Grid>

            <Box
                style={{
                    bottom: 10,
                    right: 10,
                    position: "absolute",
                }}
            >
                <CreateRoleButton onClick={() => groupCreateHandler()}>
                    Ok
                </CreateRoleButton>
                <CreateRoleButton
                    onClick={() =>
                        setCreateGroup((state) => ({ ...state, show: false }))
                    }
                >
                    Cancel
                </CreateRoleButton>
                <CreateRoleButton onClick={() =>
                    setCreateGroup((state) => ({
                        ...state,
                        selectedGroups: [],
                        selectedRoles: [],
                        securityRoleResourceList: [],
                        group: {
                            groupName: "",
                        },
                    }))
                }>Reset</CreateRoleButton>
            </Box>
        </>
    );
};
