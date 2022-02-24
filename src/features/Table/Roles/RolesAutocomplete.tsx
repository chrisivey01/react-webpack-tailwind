import { Autocomplete, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

interface Props {
    autocompleteData: any[];
    rowData: any;
    newResourceDropdownHandler: any;
}

export const RolesAutocomplete = ({
    autocompleteData,
    rowData,
    newResourceDropdownHandler,
}: Props) => {
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
                filterSelectedOptions
                onChange={(e, option: any) =>
                    newResourceDropdownHandler(option)
                }
                renderOption={(props, option, { inputValue }) => {
                    const matches = match(option.RESOURCE_NAME, inputValue);
                    const parts = parse(option.RESOURCE_NAME, matches);

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
