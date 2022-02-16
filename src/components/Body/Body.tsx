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

export const Body = () => {
    const location = useLocation();
    const [checkedState, setCheckedState] = useState<any>(false);
    const [open, setOpen] = useState<any>(false);
    const [resourceFiltered, setResourceFiltered] = useState<
        SecurityResource[]
    >([]);
    const [windowType, setWindowType] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<SecurityRole | undefined>(
        undefined
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckedState(event.target.checked);
    };

    const updateHandler = () => {
        console.log("11");
    };

    /**
     *
     * @param
     * Need to make new object here to add to resource filtered - the problem here is, we need new prop generated.
     *   ACTION_NAME: "Access"
     *   CHANGE_FLAG: "I"
     *   LAST_UPD_DT_TM: "2022-01-18 10:23:15.524329"
     *   LAST_UPD_USER: "BATCH"
     *   RESOURCE_DESC: "Ability to run the miniflow process"
     *   RESOURCE_NAME: "PRE/FLOW/MiniFlow"
     *   SECURITY_ACTION_UUID: "D5DEAE036B5F05FBE053377AFF0AED84"
     *   SECURITY_APP_EAI_NBR: 5907
     *   SECURITY_RESOURCE_UUID: "D5DEAE036BB305FBE053377AFF0AED84"
     */
    const clickHandler = (type: string) => {
        if (type === "create") {
            let resourceCopy = [...resourceFiltered];
            let securityObj: SecurityResource = {
                ACTION_NAME: "Access",
                CHANGE_FLAG: "I",
                LAST_UPD_DT_TM: new Date().toLocaleString(),
                LAST_UPD_USER: "BATCH",
                RESOURCE_DESC: "",
                RESOURCE_NAME: "",
                SECURITY_ACTION_UUID: "",
                SECURITY_APP_EAI_NBR: 5907,
                SECURITY_RESOURCE_UUID: "",
            };
            resourceCopy.push(securityObj);
            console.log(resourceCopy);
            setResourceFiltered(resourceCopy);
        }
    };

    const closeHandler = () => {};

    const changeRole = (option: SecurityRole) => {
        const securityUuid = option.SECURITY_ROLE_UUID;
        let securityRolesList: SecurityRole[] = securityRolesListJson;
        let securityRoleResourceList: SecurityRoleResource[] =
            securityRoleResourceJson;

        let filteredSecurityRoleResourceList = securityRoleResourceList.filter(
            (securityRoleResource: SecurityRoleResource) => {
                return securityRoleResource.SECURITY_ROLE_UUID === securityUuid;
            }
        );

        console.log(filteredSecurityRoleResourceList);

        let securityResourceFilteredList: SecurityResource[] = [];
        /**
         * Compares the two lists off the SECURITY_RESOURCE_UUID which
         * will return the SECURITY_ACTION_UUID which needs to be filtered off
         * SECURITY_ACTION.json
         */
        filteredSecurityRoleResourceList.map((fsrrl: SecurityRoleResource) => {
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

    const newRoleHandler = () => {
        setOpen(true);
        setWindowType("role");
    };

    const newGroupHandler = () => {
        setOpen(true);
        setWindowType("group");
    };

    const buttonView = () => {
        if (location.pathname === "/roles") {
            return (
                <Box
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        position: "absolute",
                        right: 0,
                    }}
                >
                    {checkedState ? (
                        <SaveButton>Modify</SaveButton>
                    ) : (
                        <>
                            <SaveButton onClick={() => clickHandler("create")}>
                                Add Resource
                            </SaveButton>
                            <SaveButton onClick={() => newRoleHandler()}>
                                New Role
                            </SaveButton>
                            <SaveButton onClick={() => clickHandler("update")}>
                                Save
                            </SaveButton>
                        </>
                    )}
                </Box>
            );
        }

        if (location.pathname === "/groups") {
            return (
                <Box
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        position: "absolute",
                        right: 0,
                    }}
                >
                    <SaveButton>Save</SaveButton>
                    <SaveButton onClick={() => newGroupHandler()}>
                        New
                    </SaveButton>
                </Box>
            );
        }

        if (location.pathname !== "/roles") {
            return (
                <Box
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        position: "absolute",
                        right: 0,
                    }}
                >
                    <SaveButton>Save</SaveButton>
                </Box>
            );
        }
    };

    return (
        <>
            <Container style={{ minWidth: 1200 }}>
                {buttonView()}
                <Dialog open={open}>
                    <Create setOpen={setOpen} windowType={windowType} />
                </Dialog>
                <Routes>
                    <Route path="/" element={<Users />} />
                    <Route
                        path="roles"
                        element={
                            <Roles
                                checkedState={checkedState}
                                clickHandler={clickHandler}
                                changeRole={changeRole}
                                selectedRole={selectedRole}
                                resourceFiltered={resourceFiltered}
                                securityResourceList={securityResourceJson}
                                setOpen={setOpen}
                            />
                        }
                    />
                    <Route path="groups" element={<Groups />} />
                </Routes>
            </Container>
        </>
    );
};
