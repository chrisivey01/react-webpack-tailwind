import { Autocomplete, Box, Divider, Grid, TextField } from "@mui/material";
import { SecurityResource } from "../../../../types/SecurityResource";
import { SecurityRole } from "../../../../types/SecurityRole";
import { Selector } from "../../../components/Table/Selector";
import { CreateRoleFields } from "../styles";

interface Props {
    actions: any;
    securityRolesList: SecurityRole[];
    selectedActions: any;
    setSelectedActions: any;
    roleSelectHandler: any;
    securityResourceList: SecurityResource[];
    resourceFiltered: SecurityResource[];
}

export const GroupCreator = ({
    actions,
    securityRolesList,
    selectedActions,
    setSelectedActions,
    roleSelectHandler,
    securityResourceList,
    resourceFiltered,
}: Props) => {
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
                <Selector
                    options={actions}
                    setOptions={setSelectedActions}
                    selectedActions={selectedActions}
                    setSelectedActions={setSelectedActions}
                />
                <Autocomplete
                    size="small"
                    multiple
                    id="tags-outlined"
                    options={securityRolesList}
                    getOptionLabel={(option) => option.ROLE_NAME}
                    filterSelectedOptions
                    onChange={roleSelectHandler}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Resources by Group"
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
                    options={securityResourceList}
                    getOptionLabel={(option) => option.RESOURCE_NAME}
                    filterSelectedOptions
                    value={resourceFiltered}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Resources"
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
