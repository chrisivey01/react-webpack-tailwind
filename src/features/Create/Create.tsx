import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityGroupRole } from "../../../types/SecurityGroupRole";

import * as JSON from "../../assets/json";
import { creatorState, useCreator } from "../../recoil/atoms/creator";
import { groupState } from "../../recoil/atoms/groups";
import { rolesState } from "../Roles/atom/roles";
import { Creator } from "../Roles/Create/Creator";
import { CreateRoleButton, CreateRoleContainer } from "./styles";

import {
    SecurityRole,
    SecurityRoleList,
    SecurityRoleResource,
    SecurityRoleResourceList,
    SecurityResourceList,
    SecurityResource,
} from "../../../types/SecurityRoleList";
import { appState } from "../../recoil/atoms/app";
import { httpRequestList } from "../../apis/requests";
import { SECURITY_ROLE_REQUEST } from "../../apis";
import { RoleWrapper } from "../Roles/Create/CreatePopup";
import { GroupWrapper } from "./components/GroupWrapper";

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
            {location.pathname === "/roles" ? <RoleWrapper /> : <></>}
            {location.pathname === "/group" ? <GroupWrapper /> : <></>}
        </CreateRoleContainer>
    );
};
