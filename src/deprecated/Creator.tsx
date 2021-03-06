import { Autocomplete, Box, Divider, Grid, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Selector } from "../features/Selector/Selector";
import { CreateRoleFields } from "../features/Create/styles";
import { useRecoilValue } from "recoil";
import { createRoleState } from "../atoms/createRole";
import { groupState } from "../features/Groups/atoms/groups";

interface Props {
    nameHandler: any;
    descHandler: any;
    firstMasterList: any;
    secondMasterList: any;
    filteredList: any;
    firstClickHandler: any;
    secondClickHandler: any;
    createdTextName: any;
    createdTextDescription?: any;
    firstText: string;
    secondText: string;
    firstPropDisplay: string;
    secondPropLabel: string;
    secondPropDisplay: string;
}

export const Creator = ({
    nameHandler,
    descHandler,
    firstMasterList,
    secondMasterList,
    filteredList,
    firstClickHandler,
    secondClickHandler,
    createdTextName,
    createdTextDescription,
    firstText,
    secondText,
    firstPropDisplay,
    secondPropLabel,
    secondPropDisplay,
}: Props) => {
    const location = useLocation();
    const createRole = useRecoilValue(createRoleState);
    const group = useRecoilValue(groupState);
    return (
        <Grid>
            <Box>
                <CreateRoleFields
                    label={createdTextName}
                    size="small"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={nameHandler}
                />
                <CreateRoleFields
                    label={createdTextDescription}
                    size="small"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={descHandler}
                />
            </Box>
            <Divider style={{ margin: 10 }} />
            <Box>
                <Autocomplete
                    size="small"
                    multiple
                    id="tags-outlined"
                    value={group.groupsMasterList ?? []}
                    options={group.groupsMasterList ?? []}
                    onChange={firstClickHandler}
                    // getOptionLabel={(option: any) => option[firstPropDisplay] ?? option}
                    // isOptionEqualToValue={(option: any, value: any) =>
                    //     option[firstPropDisplay] === value
                    // }
                    filterSelectedOptions
                    autoHighlight
                    autoSelect
                    sx={{ maxHeight: 120, maxWidth: 570, overflow: "auto" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={firstText}
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
                    options={secondMasterList}
                    value={filteredList ?? []}
                    getOptionLabel={(option) => option[secondPropDisplay]}
                    isOptionEqualToValue={(option: any, value: any) =>
                        option[secondPropLabel] === value[secondPropLabel]
                    }
                    filterSelectedOptions
                    autoHighlight
                    autoSelect
                    onChange={secondClickHandler}
                    sx={{
                        height: 305,
                        maxHeight: location.pathname !== "/roles" ? 305 : 220,
                        overflow: "auto",
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={secondText}
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
