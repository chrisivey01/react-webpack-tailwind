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

    const roleSelectHandler = (option: any, value: any) => {
        const roleList = value.reverse();
        const securityUuid = roleList[0].SECURITY_ROLE_UUID;
        console.log(securityUuid);
        let securityRolesList: SecurityRole[] = securityRolesListJson;
        let securityRoleResourceList: SecurityRoleResource[] =
            securityRoleResourceJson;

        let filteredSecurityRoleResourceList = securityRoleResourceList.filter(
            (securityRoleResource: SecurityRoleResource) => {
                return securityRoleResource.SECURITY_ROLE_UUID === securityUuid;
            }
        );
        setSecurityFiltered([
            ...securityFiltered,
            ...filteredSecurityRoleResourceList,
        ]);
        console.log(filteredSecurityRoleResourceList);

        let securityResourceFilteredList: SecurityResource[] = [];
        /**
         * Compares the two lists off the SECURITY_RESOURCE_UUID which
         * will return the SECURITY_ACTION_UUID which needs to be filtered off
         * SECURITY_ACTION.json
         */

        securityFiltered.map((fsrrl: SecurityRoleResource) => {
            securityResourceJson.map((srl: SecurityResource) => {
                if (
                    srl.SECURITY_RESOURCE_UUID === fsrrl.SECURITY_RESOURCE_UUID
                ) {
                    srl.SECURITY_ACTION_UUID = fsrrl.SECURITY_ACTION_UUID;
                    securityResourceFilteredList.push(srl);
                }
            });
        });

        securityResourceFilteredList.map((srr: SecurityResource) => {
            const saIndex = securityActionListJson.findIndex(
                (sa: SecurityAction) =>
                    srr.SECURITY_ACTION_UUID === sa.SECURITY_ACTION_UUID
            );
            srr.ACTION_NAME = securityActionListJson[saIndex].ACTION_NAME;
            return srr;
        });
        setResourceFiltered(securityResourceFilteredList);
        setSelectedRole(option);
    };

    return (
        <CreateRoleContainer>
            {windowType === "role" ? (
                <RoleCreator
                    actions={actions}
                    selectedActions={selectedActions}
                    setSelectedActions={setSelectedActions}
                    roleSelectHandler={roleSelectHandler}
                    securityRolesList={securityRolesListJson}
                    securityResourceList={securityResourceJson}
                    resourceFiltered={resourceFiltered}
                />
            ) : (
                <></>
            )}

            {windowType === "group" ? (
                <GroupCreator
                    actions={actions}
                    selectedActions={selectedActions}
                    setSelectedActions={setSelectedActions}
                    roleSelectHandler={roleSelectHandler}
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
