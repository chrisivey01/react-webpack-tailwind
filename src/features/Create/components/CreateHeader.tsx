import { Autocomplete, Box, Divider, Grid, TextField } from "@mui/material";
import { CreateRoleFields } from "../styles";
import securityResourceJson from "../../../assets/json/SECURITY_RESOURCE.json";
import securityRolesListJson from "../../../assets/json/SECURITY_ROLE.json";
import { Selector } from "../../../components/Table/Selector";
import { SecurityRole } from "../../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../../types/SecurityRoleResource";
import { SecurityResource } from "../../../../types/SecurityResource";
import { SecurityAction } from "../../../../types/SecurityAction";
import securityRoleResourceJson from "../../../assets/json/SECURITY_ROLE_RESOURCE.json";
import securityActionListJson from "../../../assets/json/SECURITY_ACTION.json";
import { ChangeEvent, useState } from "react";
import { RoleCreator } from "./RoleCreator";
import { GroupCreator } from "./GroupCreator";

interface Props {
    windowType: string;
}

export const CreateHeader = ({ windowType }: Props) => {
    const [securityFiltered, setSecurityFiltered] = useState<
        SecurityRoleResource[]
    >([]);
    const [resourceFiltered, setResourceFiltered] = useState<
        SecurityResource[]
    >([]);
    const [selectedRole, setSelectedRole] = useState<SecurityRole | undefined>(
        undefined
    );
    const options = [
        {
            name: "VIEW",
            value: "view",
        },
        {
            name: "HAVE",
            value: "have",
        },
        {
            name: "ACCESS",
            value: "access",
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

    if (windowType === "role") {
        return (
            <RoleCreator
                options={options}
                roleSelectHandler={roleSelectHandler}
                securityRolesList={securityRolesListJson}
                securityResourceList={securityResourceJson}
                resourceFiltered={resourceFiltered}
            />
        );
    } else if (windowType === "group") {
        return (
            <GroupCreator
                options={options}
                roleSelectHandler={roleSelectHandler}
                securityRolesList={securityRolesListJson}
                securityResourceList={securityResourceJson}
                resourceFiltered={resourceFiltered}
            />
        );
    } else {
        return <></>;
    }
};
