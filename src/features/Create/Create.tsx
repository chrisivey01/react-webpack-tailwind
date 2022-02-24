import { Box, Divider, Grid } from "@mui/material";
import { useState } from "react";
import { SecurityAction } from "../../../types/SecurityAction";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import securityActionListJson from "../../assets/json/SECURITY_ACTION.json";
import securityResourceJson from "../../assets/json/SECURITY_RESOURCE.json";
import securityRolesListJson from "../../assets/json/SECURITY_ROLE.json";
import securityRoleResourceJson from "../../assets/json/SECURITY_ROLE_RESOURCE.json";
import { GroupCreator } from "./components/GroupCreator";
import { RoleCreator } from "./components/RoleCreator";
import { CreateRoleButton, CreateRoleContainer } from "./styles";

interface Props {
    setOpen: any;
    windowType: string;
}
export const Create = ({ setOpen, windowType }: Props) => {
    const [securityFiltered, setSecurityFiltered] = useState<
        SecurityRoleResource[]
    >([]);
    const [resourceFiltered, setResourceFiltered] = useState<
        SecurityResource[]
    >([]);
    const [selectedRole, setSelectedRole] = useState<SecurityRole | undefined>(
        undefined
    );

    const [selectedActions, setSelectedActions] = useState<any>("view");

    const actions = [
        {
            name: "VIEW",
            value: "view",
        },
        {
            name: "EDIT",
            value: "edit",
        },
    ];

    return (
        <CreateRoleContainer>
            {windowType === "role" ? <RoleCreator /> : <></>}

            {windowType === "group" ? (
                <GroupCreator
                    actions={actions}
                    selectedActions={selectedActions}
                    setSelectedActions={setSelectedActions}
                    securityRolesList={securityRolesListJson}
                    securityResourceList={securityResourceJson}
                    resourceFiltered={resourceFiltered}
                />
            ) : (
                <></>
            )}

            <Box
                style={{
                    bottom: 10,
                    right: 10,
                    position: "absolute",
                }}
            >
                <CreateRoleButton onClick={() => setOpen(false)}>
                    Ok
                </CreateRoleButton>
                <CreateRoleButton onClick={() => setOpen(false)}>
                    Cancel
                </CreateRoleButton>
                <CreateRoleButton>Reset</CreateRoleButton>
            </Box>
        </CreateRoleContainer>
    );
};
