import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { actionSelectorCreate } from "../Create/creator-slice";
import { updateResourceAction } from "../Roles/roles-slice";

const SelectAction = styled(Select)`
    font-size: 12px;
    width: auto !important;
    min-width: 70px;
    margin-left: 3px;
    padding: 0px !important;

    .MuiInputBase-input {
        padding: 5px;
    }
`;

interface Props {
    rowData?: any;
    options?: any;
    table?: boolean;
    index: number;
}

export const Selector = ({ rowData, table, index }: Props) => {
    const dispatch = useDispatch();
    const actionSelected = useSelector(
        (state: any) => state.creator.actionSelected
    );
    const filteredResourceList = useSelector(
        (state: any) => state.roles.filteredResourceList
    );

    const actionOptions: any = [
        {
            name: "VIEW",
            value: "view",
        },
        {
            name: "EDIT",
            value: "edit",
        },
    ];
    const actionSelectorHandler = (option: any) => {
        if (table) {
            let filteredResourceListCopy: any[] = [...filteredResourceList];
            let copyObj = Object.assign({}, filteredResourceListCopy[index]);
            copyObj.ACTION_NAME = option.target.value;
            copyObj.COLOR = "yellow";
            filteredResourceListCopy[index] = copyObj;
            dispatch(updateResourceAction(filteredResourceListCopy));
        } else {
            dispatch(actionSelectorCreate(option.target.value));
        }
    };
    return (
        <FormControl>
            <Box style={{ display: "flex", alignItems: "center", margin: 8 }}>
                <Typography style={{ fontSize: 12 }}>
                    Action Selected:
                </Typography>
                {rowData && rowData.ACTION_NAME ? (
                    <SelectAction
                        onChange={actionSelectorHandler}
                        value={rowData.ACTION_NAME.toLowerCase()}
                    >
                        {actionOptions.map((option: any, index: number) => (
                            <MenuItem
                                key={index}
                                value={option.value}
                                style={{ fontSize: 12 }}
                            >
                                {option.name}
                            </MenuItem>
                        ))}
                    </SelectAction>
                ) : (
                    <SelectAction
                        onChange={actionSelectorHandler}
                        value={actionSelected}
                    >
                        {actionOptions.map((option: any, index: number) => (
                            <MenuItem
                                key={index}
                                value={option.value}
                                style={{ fontSize: 12 }}
                            >
                                {option.name}
                            </MenuItem>
                        ))}
                    </SelectAction>
                )}
            </Box>
        </FormControl>
    );
};
