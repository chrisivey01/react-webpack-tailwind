import { Box, Container, Switch, Typography } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { Groups } from "../../features/Groups";
import { Roles } from "../../features/Roles";
import { Users } from "../../features/Users";
import { Dialog, SaveButton } from "./styles";
import { ChangeEvent, useState } from "react";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityAction } from "../../../types/SecurityAction";
import securityRoleResourceJson from "../../assets/json/SECURITY_ROLE_RESOURCE.json";
import securityRolesListJson from "../../assets/json/SECURITY_ROLE.json";
import securityResourceJson from "../../assets/json/SECURITY_RESOURCE.json";
import securityActionListJson from "../../assets/json/SECURITY_ACTION.json";
import { Create } from "../../features/Create/Create";
import { ActionButtons } from "../ActionButtons/ActionButtons";

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
