import { Box, Container, Dialog, Switch, Typography } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { Groups } from "../../features/Groups";
import { Roles } from "../../features/Roles";
import { Users } from "../../features/Users";
import { SaveButton } from "./styles";
import { ChangeEvent, useState } from "react";
import TransferList from "../../features/Roles/CreateRoles/TransferList";

export const Body = () => {
    const location = useLocation();
    const [checkedState, setCheckedState] = useState<any>(false);
    const [open, setOpen] = useState<any>(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckedState(event.target.checked);
    };

    const updateHandler = () => {
        console.log("11");
    };

    const clickHandler = (type: string) => {
        if (type === "create") {
            setOpen(true);
        }
    };

    const closeHandler = () => {};

    const buttonView = () => {
        if (location.pathname === "/roles") {
            return (
                <>
                    {checkedState ? (
                        <SaveButton>Modify</SaveButton>
                    ) : (
                        <SaveButton onClick={() => clickHandler("create")}>
                            Save
                        </SaveButton>
                    )}
                </>
            );
        }

        if (location.pathname !== "/roles") {
            return <SaveButton>Save</SaveButton>;
        }
    };

    return (
        <>
            <Container style={{ minWidth: 1200 }}>
                {buttonView()}
                <Dialog open={open}>
                    <TransferList />
                </Dialog>
                <Routes>
                    <Route path="/" element={<Users />} />
                    <Route
                        path="roles"
                        element={<Roles checkedState={checkedState} />}
                    />
                    <Route path="groups" element={<Groups />} />
                </Routes>
            </Container>
        </>
    );
};
