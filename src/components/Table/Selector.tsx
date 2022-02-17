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
    options: any;
    setOptions: any;
    setSelectedActions: any;
    selectedActions: any;
}

export const Selector = ({ options, setOptions, setSelectedActions, selectedActions }: Props) => {
    const selectHandler = (event: any) => {
        setSelectedActions(event.target.value);
    };

    return (
        <FormControl>
            <Box style={{ display: "flex", alignItems: "center", margin: 8 }}>
                <Typography style={{ fontSize: 12 }}>
                    Action Selected:
                </Typography>
                <SelectAction onChange={selectHandler} value={selectedActions}>
                    {options.map((option: any, index: number) => (
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
