import { Autocomplete, TextField } from "@mui/material";

interface Props {
    autocompleteData: any[];
    rowData: any;
}

export const RolesAutocomplete = ({ autocompleteData, rowData }: Props) => {
    if (rowData.RESOURCE_NAME === "") {
        return (
            <Autocomplete
                size="small"
                sx={{
                    width: 500,
                }}
                id="tags-outlined"
                options={autocompleteData}
                getOptionLabel={(option) => option.RESOURCE_NAME}
                value={rowData}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        style={{
                            fontSize: 12,
                        }}
                        margin="normal"
                    />
                )}
            />
        );
    } else {
        return <>{rowData.RESOURCE_NAME}</>;
    }
};
