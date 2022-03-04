import { Container } from "@mui/material";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Create } from "../../features/Create/Create";
import { Groups } from "../../features/Groups";
import { Roles } from "../../features/Roles";
import { Users } from "../../features/Users";
import { ActionButtons } from "../ActionButtons/ActionButtons";
import { Dialog } from "./styles";

export const Body = () => {
    const [open, setOpen] = useState<any>(false);
    const [windowType, setWindowType] = useState<string>("");

    return (
        <>
            <Container style={{ minWidth: 1200 }}>
                <ActionButtons
                    setOpen={setOpen}
                    setWindowType={setWindowType}
                />
                <Dialog open={open}>
                    <Create setOpen={setOpen} windowType={windowType} />
                </Dialog>
                <Routes>
                    <Route path="/" element={<Users />} />
                    <Route path="roles" element={<Roles />} />
                    <Route path="groups" element={<Groups />} />
                </Routes>
            </Container>
        </>
    );
};
