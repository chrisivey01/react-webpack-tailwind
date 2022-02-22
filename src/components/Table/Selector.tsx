import {
    Box,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import styled from "styled-components";

interface Props {
    cl?: any;
    value?: any;
    handleChange?: any;
    options: any;
}

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
    actionSelectorHandler: any;
    rowData: any;
}

export const Selector = ({
    actionSelectorHandler,
    rowData,
}: Props) => {
    const actionOptions = [
        {
            name: "VIEW",
            value: "view",
        },
        {
            name: "HAVE",
            value: "have",
        },
        {
            name: "ACCESS",
            value: "access",
        },
        {
            name: "EDIT",
            value: "edit",
        },
    ];
    return (
        <FormControl>
            <Box style={{ display: "flex", alignItems: "center", margin: 8 }}>
                <Typography style={{ fontSize: 12 }}>
                    Action Selected:
                </Typography>
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
            </Box>
        </FormControl>
    );
};
