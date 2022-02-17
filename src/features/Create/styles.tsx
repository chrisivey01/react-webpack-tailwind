import {
    Box,
    Button,
    Grid,
    TextField as MuiTextField,
    TextField,
    Autocomplete as AutocompleteMui,
} from "@mui/material";
import styled from "styled-components";

export const CreateRoleButton = styled(Button)`
    margin: 5px;
    right: 0;
    color: rgb(255, 255, 255);
    box-shadow: none;
    text-transform: none;
    font-size: 12px;
    padding: 6px 12px;
    line-height: 1.5;
    background-color: #0063cc;
    border: 1px solid #0063cc;
    &:hover {
        background-color: #0069d9;
        border-color: #0062cc;
        box-shadow: none;
    }
    &:active {
        box-shadow: none;
        background-color: #0062cc;
        border-color: #005cbf;
    }
    &:focus {
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
    }
`;

export const CreateRoleContainer = styled(Box)`
    width: 100%;
    height: 100%;
    padding: 10px;
`;

export const CreateRoleFields = styled(TextField)`
    margin: 10px;
    display: block;
    padding-bottom: 10px;
    .MuiOutlinedInput-root {
        width: 70%;
    }
    input {
        font-size: 12px;
    }
`;

export const Autocomplete = styled<any>(AutocompleteMui)`
`;
