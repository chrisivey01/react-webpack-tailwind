import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { appState } from "../../atom/app";
import { GroupPopup } from "../Groups/Create/GroupPopup";
import { RolePopup } from "../Roles/Create/RolePopup";
import { CreateRoleContainer } from "./styles";

export const Create = () => {
    const location = useLocation();
    const app = useRecoilValue(appState);

    return (
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
            {location.pathname === "/group" ? <GroupPopup /> : <></>}
        </CreateRoleContainer>
    );
};
