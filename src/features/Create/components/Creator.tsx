import { Autocomplete, Box, Divider, Grid, TextField } from "@mui/material";
import { useRecoilValue } from "recoil";
import { creatorState } from "../../../recoil/atoms/creator";
import { CreateRoleFields } from "../styles";

interface Props {
    firstMasterList: any;
    secondMasterList: any;
    filteredList: any;
    firstClickHandler: any;
    secondClickHandler: any;
    firstText: string;
    secondText: string;
    firstPropDisplay: string;
    secondPropDisplay: string;
}

export const Creator = ({
    firstMasterList,
    secondMasterList,
    filteredList,
    firstClickHandler,
    secondClickHandler,
    firstText,
    secondText,
    firstPropDisplay,
    secondPropDisplay,
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
                <Autocomplete
                    size="small"
                    multiple
                    id="tags-outlined"
                    options={firstMasterList}
                    onChange={firstClickHandler}
                    getOptionLabel={(option: any) => option[firstPropDisplay]}
                    filterSelectedOptions
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
                    filterSelectedOptions
                    onChange={secondClickHandler}
                    isOptionEqualToValue={(option: any, value: any) =>
                        option[secondPropDisplay] === value[secondPropDisplay]
                    }
                    sx={{
                        height: 305,
                        maxHeight: 305,
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
