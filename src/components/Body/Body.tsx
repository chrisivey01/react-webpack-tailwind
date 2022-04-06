import { Box, Container, styled, Typography } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Create } from "../../features/Create/Create";
import { Groups } from "../../features/Groups";
import { createGroupState } from "../../features/Groups/atoms/createGroup";
import { GroupPopup } from "../../features/Groups/Create/GroupPopup";
import { Roles } from "../../features/Roles";
import { createRoleState } from "../../features/Roles/atoms/createRole";
import { RolePopup } from "../../features/Roles/Create/RolePopup";
import { Users } from "../../features/Users";
import { ActionButtons } from "../ActionButtons/ActionButtons";
import { Dialog } from "./styles";



export const CreateRoleContainer = styled(Box)`
    width: 100%;
    height: 100%;
    padding: 10px;
`;


export const Body = () => {
    const location = useLocation();
    const createRole = useRecoilValue(createRoleState);
    const createGroup = useRecoilValue(createGroupState);
    return (
        <Container>
            <ActionButtons />
            <Dialog open={createRole.show || createGroup.show}>
                <CreateRoleContainer>
                    {location.pathname === "/roles" ? (
                        <Typography sx={{ fontWeight: 600, padding: "20x" }}>
                            New Role
                        </Typography>
                    ) : (
                        <Typography sx={{ fontWeight: 600, padding: "20x" }}>
                            New Group
                        </Typography>
                    )}
                    {location.pathname === "/roles" ? <RolePopup /> : <></>}
                    {location.pathname === "/groups" ? <GroupPopup /> : <></>}
                </CreateRoleContainer>
            </Dialog>
            <Routes>
                <Route path="/" element={<Users />} />
                <Route path="roles" element={<Roles />} />
                <Route path="groups" element={<Groups />} />
            </Routes>
        </Container>
    );
};
