import { Container } from "@mui/material";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Create } from "../../features/Create/Create";
import { Groups } from "../../features/Groups";
import { Roles } from "../../features/Roles";
import { createRoleState } from "../../features/Roles/atom/createRole";
import { Users } from "../../features/Users";
import { creatorState } from "../../recoil/atoms/creator";
import { ActionButtons } from "../ActionButtons/ActionButtons";
import { Dialog } from "./styles";

export const Body = () => {
    const createRole = useRecoilValue(createRoleState);
    return (
        <>
            <Container>
                <ActionButtons />
                <Dialog open={createRole.show}>
                    <Create />
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
