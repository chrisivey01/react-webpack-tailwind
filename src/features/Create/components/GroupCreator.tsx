import { Autocomplete, Box, Divider, Grid, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SecurityGroup } from "../../../../types/SecurityGroup";
import { SecurityGroupRole } from "../../../../types/SecurityGroupRole";
import { SecurityRole } from "../../../../types/SecurityRole";
import { RootState } from "../../../store";
import { addSingleRoleHandler, setRoleFiltered } from "../creator-slice";
import { CreateRoleFields } from "../styles";

export const GroupCreator = () => {
    const dispatch = useDispatch();
    const groupsMasterList = useSelector(
        (state: RootState) => state.groups.groupsMasterList
    );
    const groupsRoleMasterList = useSelector(
        (state: RootState) => state.groups.groupsRoleMasterList
    );
    const rolesMasterList = useSelector(
        (state: RootState) => state.groups.rolesMasterList
    );
    const rolesFiltered = useSelector(
        (state: RootState) => state.creator.rolesFiltered
    );

    const groupSelectHandler = (option: any, value: any) => {
        let securityGroupRoleSelected: SecurityGroupRole[] = [];

        value.forEach((sg: SecurityGroup) => {
            console.log(sg);
            groupsRoleMasterList.forEach((grml: SecurityGroupRole) => {
                if (sg.SECURITY_GROUP_UUID === grml.SECURITY_GROUP_UUID) {
                    securityGroupRoleSelected.push(grml);
                }
            });
        });

        let filteredRoles: SecurityRole[] = [];
        securityGroupRoleSelected.forEach((sgrs: SecurityGroupRole) => {
            rolesMasterList.forEach((rml: SecurityRole) => {
                if (sgrs.SECURITY_ROLE_UUID === rml.SECURITY_ROLE_UUID) {
                    filteredRoles.push(rml);
                }
            });
        });

        dispatch(setRoleFiltered(filteredRoles));
    };

    const roleSelectHandler = (option: any, rolesList: any) => {
        let resourceObj = Object.assign({}, rolesList[rolesList.length - 1]);
        rolesList[rolesList.length - 1] = resourceObj;
        dispatch(addSingleRoleHandler(rolesList));
    };

    return (
        <Grid>
            <Box>
                <CreateRoleFields
                    label="Group Name"
                    size="small"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <CreateRoleFields
                    label="Description"
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
                    options={groupsMasterList}
                    onChange={groupSelectHandler}
                    getOptionLabel={(option: any) => option.GROUP_NAME}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Group to Copy"
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
                    options={rolesMasterList}
                    value={rolesFiltered}
                    getOptionLabel={(option) => option.ROLE_NAME}
                    filterSelectedOptions
                    onChange={roleSelectHandler}
                    sx={{
                        height: 305,
                        maxHeight: 305,
                        overflow: "auto",
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Roles"
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
    );
};
