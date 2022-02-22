import { Dialog as MuiDialog, Button, styled } from "@mui/material";



export const Dialog = styled(MuiDialog)`
    .MuiDialog-paper {
        position: relative;
        width: 1000px;
        height: 600px;
        overflow: unset;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid;
    }
`;
