import { Box, TextField as MuiTextField, TextField } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Box)`
    display: flex;
`;

export const Wrapper = styled(Box)``;

export const GroupRolesContainer = styled(Box)`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
`;

export const RoleField = styled(TextField)`
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

export const RoleDescField = styled(TextField)`
    margin: 10px;
    display: block;
    padding-bottom: 10px;
    .MuiOutlinedInput-root {
        width: 90%;
    }
    input {
        font-size: 12px;
    }
`;
