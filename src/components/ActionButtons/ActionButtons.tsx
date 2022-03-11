import { Box } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
    SecurityResource,
    SecurityRoleList,
} from "../../../types/SecurityRoleList";
import { SECURITY_ROLE_SAVE_REQUEST } from "../../apis";
import { httpRequestList } from "../../apis/requests";
import {
    NotificationState,
    Severity,
    useNotification,
} from "../../features/Notification/atom";
import {
    createRoleState,
    useCreateRole,
} from "../../features/Roles/atom/createRole";
import { rolesState, useRoles } from "../../features/Roles/atom/roles";
import { appState } from "../../recoil/atoms/app";
import { SaveButton } from "./styles";

export const ActionButtons = () => {
    const location = useLocation();
    const roles = useRecoilValue(rolesState);
    const setRoles = useRoles();
    const [checkedState, setCheckedState] = useState<any>(false);
    const createRole = useRecoilValue(createRoleState);
    const setCreate = useCreateRole();
    const app = useRecoilValue(appState);
    const setNotification = useNotification();

    const clickHandler = (type: string) => {
        if (type === "create") {
            let rolesCopy = JSON.parse(JSON.stringify(roles.roleSelected));

            let securityObj: SecurityResource = {
                securityAction: {},
                changeFlg: "I",
                lastUpdDtTm: "",
                lastUpdUser: app.employee.employeeId,
                resourceDesc: "",
                resourceName: "",
                securityResourceUuid: "",
                securityAppEaiNbr: 5907,
                securityResource: {
                    changeFlag: "I",
                    lastUpdDtTm: "",
                    lastUpdUser: app.employee.employeeId,
                    resourceName: "",
                    securityAppEaiNbr: 0,
                    securityResourceUuid: "",
                },
            };

            rolesCopy.securityRoleResourceList.push(securityObj);

            setRoles((state) => ({
                ...state,
                roleSelected: rolesCopy,
            }));
        }
    };

    const closeHandler = () => {};

    const newRoleHandler = () => {
        setCreate((state) => ({
            ...state,
            show: true,
        }));
    };

    const newGroupHandler = () => {
        setCreate((state) => ({
            ...state,
            show: true,
        }));
    };

    const saveHandler = async () => {
        if (location.pathname === "/roles") {
            let params: any = {};
            if (createRole.createdPending) {
                params = {
                    userId: app.employee.employeeId,
                    securityRoleList: createRole.securityRoleList,
                };

                try {
                    await httpRequestList(SECURITY_ROLE_SAVE_REQUEST, params);
                    setNotification((state) => ({
                        ...state,
                        show: true,
                        message: "Success!",
                        severity: Severity.success,
                    }));
                } catch (err: any) {
                    setNotification((state) => ({
                        ...state,
                        show: true,
                        message: err,
                        severity: Severity.error,
                    }));
                }

                setCreate((state) => ({
                    ...state,
                    createdPending: false,
                }));
            } else {
                params = {
                    userId: app.employee.employeeId,
                    securityRoleList: [],
                };
                params.securityRoleList.push(roles.roleSelected);

                try {
                    await httpRequestList(SECURITY_ROLE_SAVE_REQUEST, params);
                    setNotification((state) => ({
                        ...state,
                        show: true,
                        message: "Save Success!",
                        severity: Severity.success,
                    }));
                } catch (err: any) {
                    setNotification((state) => ({
                        ...state,
                        show: true,
                        message: err,
                        severity: Severity.error,
                    }));
                }
            }
        }
    };

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
                    <SaveButton sx={{ backgroundColor: "#0063cc" }}>
                        Modify
                    </SaveButton>
                ) : (
                    <>
                        <SaveButton
                            sx={{ backgroundColor: "#0063cc" }}
                            disabled={roles.filteredResourceList === undefined}
                            onClick={() => clickHandler("create")}
                        >
                            Add Resource
                        </SaveButton>
                        <SaveButton
                            sx={{ backgroundColor: "#0063cc" }}
                            onClick={() => newRoleHandler()}
                        >
                            New Role
                        </SaveButton>
                        <SaveButton
                            sx={{
                                backgroundColor: createRole.createdPending
                                    ? "#00FF00"
                                    : "#0063cc",
                            }}
                            onClick={() => saveHandler()}
                        >
                            Save
                        </SaveButton>
                    </>
                )}
            </Box>
        );
    } else if (location.pathname === "/groups") {
        return (
            <Box
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    position: "absolute",
                    right: 0,
                }}
            >
                <SaveButton onClick={() => newGroupHandler()}>
                    New Group
                </SaveButton>
                <SaveButton>Save</SaveButton>
            </Box>
        );
    } else if (location.pathname !== "/roles") {
        return (
            <Box
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    position: "absolute",
                    right: 0,
                }}
            >
                <SaveButton onClick={() => saveHandler()}>Save</SaveButton>
            </Box>
        );
    } else {
        return <></>;
    }
};
