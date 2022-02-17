import { Dialog as MuiDialog, Button, styled } from "@mui/material";

export const SaveButton = styled(Button)`
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
