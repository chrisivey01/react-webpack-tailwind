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
    if (rowData.resourceName === "") {
        return (
            <Autocomplete
                size="small"
                sx={{
                    width: 500,
                }}
                id="tags-outlined"
                options={autocompleteData}
                getOptionLabel={(option) => option.resourceName}
                filterSelectedOptions
                onChange={(e, option: any) =>
                    newResourceDropdownHandler(option)
                }
                renderOption={(props, option, { inputValue }) => {
                    const matches = match(option.resourceName, inputValue);
                    const parts = parse(option.resourceName, matches);

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
        return <>{rowData.resourceName}</>;
    }
};
