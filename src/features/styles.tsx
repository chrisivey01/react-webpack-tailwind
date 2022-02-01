import { Box, Container } from "@mui/material";
import styled from "styled-components";

export const PageContainer = styled(Box)`
    display: flex;
    width: 100%;
    justify-content: space-around;
`;

export const PageWrapper = styled(Container)`
    display: flex;
    flex-wrap: wrap;
`;

export const OptionsWrapper = styled(Box)`
    padding-bottom: 10px;
`