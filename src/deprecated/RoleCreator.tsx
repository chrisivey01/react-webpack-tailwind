import { Box, Chip, Divider, Grid, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SecurityAction } from "../../types/SecurityAction";
import { SecurityResource } from "../../types/SecurityResource";
import { SecurityRoleResource } from "../../types/SecurityRoleResource";
import * as JSON from "../assets/json";
import { Selector } from "../features/Selector/Selector";
import {
    rolesSelectedHandler,
    rolesSingleSelectHandler,
} from "./creator-slice";
import { Autocomplete, CreateRoleFields } from "../features/Create/styles";

export const RoleCreator = () => {
    const dispatch = useDispatch();
    const rolesMasterList = useSelector(
        (state: any) => state.roles.rolesMasterList
    );
    const resourcesMasterList = useSelector(
        (state: any) => state.roles.resourcesMasterList
    );
    const resourcesFiltered = useSelector(
        (state: any) => state.creator.resourcesFiltered
    );
    const actionSelected = useSelector(
        (state: any) => state.creator.actionSelected
    );

    // const roleSelectHandler = (option: any, value: any) => {
    //     const roleList = value.reverse();
    //     const securityUuid = roleList[0].SECURITY_ROLE_UUID;
    //     let securityRoleResourceList: SecurityRoleResource[] =
    //         JSON.securityRoleResourceJson;

    //     let filteredSecurityRoleResourceList = securityRoleResourceList.filter(
    //         (securityRoleResource: SecurityRoleResource) => {
    //             return securityRoleResource.SECURITY_ROLE_UUID === securityUuid;
    //         }
    //     );

    //     let securityResourceFilteredList: SecurityResource[] = [];
    //     /**
    //      * Compares the two lists off the SECURITY_RESOURCE_UUID which
    //      * will return the SECURITY_ACTION_UUID which needs to be filtered off
    //      * SECURITY_ACTION.json
    //      */

    //     filteredSecurityRoleResourceList.map((fsrrl: SecurityRoleResource) => {
    //         resourcesMasterList.map((srl: SecurityResource) => {
    //             if (
    //                 srl.SECURITY_RESOURCE_UUID === fsrrl.SECURITY_RESOURCE_UUID
    //             ) {
    //                 let srlCopy = Object.assign({}, srl);
    //                 srlCopy.SECURITY_ACTION_UUID = fsrrl.SECURITY_ACTION_UUID;
    //                 securityResourceFilteredList.push(srlCopy);
    //             }
    //         });
    //     });

    //     securityResourceFilteredList.map((srr: SecurityResource) => {
    //         const saIndex = JSON.securityActionJson.findIndex(
    //             (sa: SecurityAction) =>
    //                 srr.SECURITY_ACTION_UUID === sa.SECURITY_ACTION_UUID
    //         );
    //         srr.ACTION_NAME = JSON.securityActionJson[saIndex].ACTION_NAME;
    //         return srr;
    //     });

    //     dispatch(rolesSelectedHandler(securityResourceFilteredList));
    // };

    // const resourceSelectHandler = (option: any, resourceList: any) => {
    //     let resourceObj = Object.assign(
    //         {},
    //         resourceList[resourceList.length - 1]
    //     );
    //     resourceObj.ACTION_NAME = actionSelected;
    //     resourceList[resourceList.length - 1] = resourceObj;
    //     dispatch(rolesSingleSelectHandler(resourceList));
    // };

    return (
        <Grid>
            <Box>
                <CreateRoleFields
                    label="Role Name"
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
            <Box style={{ width: "100%" }}>
                <Autocomplete
                    size="small"
                    multiple
                    fullWidth={true}
                    id="tags-outlined"
                    options={rolesMasterList}
                    getOptionLabel={(option: any) => option.ROLE_NAME}
                    filterSelectedOptions
                    onChange={roleSelectHandler}
                    sx={{ maxHeight: 120, maxWidth: 570, overflow: "auto" }}
                    renderInput={(params: any) => (
                        <TextField
                            {...params}
                            label="Select Role to Copy"
                            maxRows={3}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                />
                <Divider style={{ margin: 10 }} />
                <Selector />
                <Autocomplete
                    size="small"
                    multiple
                    fullWidth
                    id="tags-outlined"
                    options={resourcesMasterList}
                    value={resourcesFiltered}
                    getOptionLabel={(option: any) => option.RESOURCE_NAME}
                    filterSelectedOptions
                    onChange={resourceSelectHandler}
                    isOptionEqualToValue={(option: any, value: any) =>
                        option.RESOURCE_NAME === value.RESOURCE_NAME
                    }
                    sx={{
                        height: 205,
                        maxHeight: 205,
                        overflow: "auto",
                    }}
                    renderTags={(tagValue: any, getTagProps: any) =>
                        tagValue.map((option: any, index: any) => {
                            return (
                                <Chip
                                    label={
                                        option.ACTION_NAME.toLowerCase() ===
                                        "view"
                                            ? option.RESOURCE_NAME + " [VIEW]"
                                            : option.RESOURCE_NAME + " [EDIT]"
                                    }
                                    {...getTagProps({ index })}
                                />
                            );
                        })
                    }
                    renderInput={(params: any) => (
                        <TextField
                            {...params}
                            label="Select Resources"
                            maxRows={3}
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
