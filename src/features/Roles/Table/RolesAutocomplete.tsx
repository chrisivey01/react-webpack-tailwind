import { Autocomplete, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { SecurityResource } from "../../../../types/SecurityRole";
import { rolesState, useRoles } from "../atoms/roles";

interface Props {
    rowData: any;
    newResourceDropdownHandler: any;
}

export const RolesAutocomplete = ({
    rowData,
    newResourceDropdownHandler,
}: Props) => {
    const roles = useRecoilValue(rolesState);
    const setRoles = useRoles();

    useEffect(() => {
        if (roles.filteredResourceList && roles.filteredResourceList.length > 0) {
            let copyResourceMasterList = [...roles.resourcesMasterList];
            roles.filteredResourceList.map((frr: SecurityResource) => {
                let foundIndex = copyResourceMasterList.findIndex(
                    (res: SecurityResource) =>
                        res.resourceName === frr.resourceName
                );
                if (foundIndex !== -1) {
                    copyResourceMasterList.splice(foundIndex, 1);
                }
            });

            setRoles((state) => ({
                ...state,
                resourcesLeft: copyResourceMasterList,
            }));
        }
    }, [roles.filteredResourceList]);

    if (rowData.securityResource.resourceName === "") {
        return (
            <Autocomplete
                size="small"
                sx={{
                    width: 500,
                }}
                id="tags-outlined"
                options={roles.resourcesLeft}
                isOptionEqualToValue={(option: any, value: any) =>
                    option["resourceName"] === value["resourceName"]
                }
                getOptionLabel={(option: any) => option.resourceName}
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
        return <>{rowData.securityResource.resourceName}</>;
    }
};
