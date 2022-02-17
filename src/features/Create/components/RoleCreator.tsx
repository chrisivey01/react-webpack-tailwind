import { Box, Chip, Divider, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { SecurityResource } from "../../../../types/SecurityResource";
import { SecurityRole } from "../../../../types/SecurityRole";
import { Selector } from "../../../components/Table/Selector";
import { Autocomplete, CreateRoleFields } from "../styles";

interface Props {
    actions: any;
    securityRolesList: SecurityRole[];
    selectedActions: any;
    setSelectedActions: any;
    roleSelectHandler: any;
    securityResourceList: SecurityResource[];
    resourceFiltered: SecurityResource[];
}

export const RoleCreator = ({
    actions,
    securityRolesList,
    selectedActions,
    setSelectedActions,
    roleSelectHandler,
    securityResourceList,
    resourceFiltered,
}: Props) => {
    useEffect(() => {
        console.log(resourceFiltered);
    }, [resourceFiltered]);

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
                    options={securityRolesList}
                    getOptionLabel={(option: any) => option.ROLE_NAME}
                    filterSelectedOptions
                    onChange={roleSelectHandler}
                    sx={{ maxHeight: 120, maxWidth: 570, overflow: "auto" }}
                    renderInput={(params: any) => (
                        <TextField
                            {...params}
                            label="Select Resources by Role"
                            maxRows={3}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                />
                <Divider style={{ margin: 10 }} />
                <Selector
                    options={actions}
                    setOptions={setSelectedActions}
                    selectedActions={selectedActions}
                    setSelectedActions={setSelectedActions}
                />
                <Autocomplete
                    size="small"
                    multiple
                    fullWidth
                    id="tags-outlined"
                    options={securityResourceList}
                    getOptionLabel={(option: any) => option.RESOURCE_NAME}
                    filterSelectedOptions
                    value={resourceFiltered}
                    sx={{
                        height: 205,
                        maxHeight: 205,
                        maxWidth: 570,
                        overflow: "auto",
                    }}
                    renderTags={(tagValue: any, getTagProps: any) =>
                        tagValue.map((option: any, index: any) => {
                            console.log(option);
                            return (
                                <Chip
                                    // sx={{
                                    //     color:
                                    //         option.ACTION_NAME.toLowerCase() ===
                                    //         "view"
                                    //             ? "blue"
                                    //             : "orange",
                                    // }}
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
