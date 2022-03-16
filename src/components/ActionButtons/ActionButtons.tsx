import { Box } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
    SecurityResource
} from "../../../types/SecurityRole";
import { SECURITY_GROUP_SAVE_REQUEST, SECURITY_ROLE_SAVE_REQUEST } from "../../apis";
import { httpRequestList } from "../../apis/requests";
import { appState } from "../../atom/app";
import { createGroupState, useCreateGroup } from "../../features/Groups/atoms/createGroup";
import { groupState, useGroups } from "../../features/Groups/atoms/groups";
import {
    Severity,
    useNotification
} from "../../features/Notification/atom";
import {
    createRoleState,
    useCreateRole
} from "../../features/Roles/atoms/createRole";
import { rolesState, useRoles } from "../../features/Roles/atoms/roles";
import { SaveButton } from "./styles";

export const ActionButtons = () => {
    const location = useLocation();
    const [checkedState, setCheckedState] = useState<any>(false);
    const app = useRecoilValue(appState);
    const setNotification = useNotification();
    /**
     * create role state
     */
    const createRole = useRecoilValue(createRoleState);
    const setCreate = useCreateRole();

    /**
     * role state
     */
    const role = useRecoilValue(rolesState);
    const setRoles = useRoles();


    /**
     * group state
     */
    const group = useRecoilValue(groupState);
    const createGroup = useRecoilValue(createGroupState);
    const setCreateGroup = useCreateGroup();

    const clickHandler = (type: string) => {
        if (type === "create") {
            if (role.roleSelected) {
                let rolesCopy = JSON.parse(JSON.stringify(role.roleSelected));

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
            } else {
                setNotification((state) => ({
                    ...state,
                    show: true,
                    message:
                        "You cannot add a resource until a role is selected.",
                    severity: Severity.error,
                }));
            }
        }
    };

    const closeHandler = () => { };

    const newRoleHandler = () => {
        setCreate((state) => ({
            ...state,
            show: true,
        }));
    };

    const newGroupHandler = () => {
        setCreateGroup((state) => ({
            ...state,
            show: true,
        }));
    };

    const saveHandler = async () => {
        let params: any = {};
        if (location.pathname === "/roles") {
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
                params.securityRoleList.push(role.roleSelected);

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

        if (location.pathname === "/groups") {

            if (createGroup.createdPending) {
                params = createGroup.newGroup;
                try {
                    await httpRequestList(SECURITY_GROUP_SAVE_REQUEST, params);
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

                setCreateGroup((state) => ({
                    ...state,
                    createdPending: false,
                }));

            } else {

                params = {
                    userId: app.employee.employeeId,
                    securityGroupList: [],
                };

                params.securityGroupList.push(group.selectedGroup);

                try {
                    await httpRequestList(SECURITY_GROUP_SAVE_REQUEST, params);
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

        };
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
                            sx={{
                                visibility:
                                    role.roleSelected === undefined
                                        ? "hidden"
                                        : "visible",
                                backgroundColor: "#0063cc",
                            }}
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
                <SaveButton sx={{ backgroundColor: "#0063cc" }} onClick={() => newGroupHandler()}>
                    New Group
                </SaveButton>
                <SaveButton sx={{
                    backgroundColor: createGroup.createdPending
                        ? "#00FF00"
                        : "#0063cc",
                }} onClick={() => saveHandler()}>Save</SaveButton>
            </Box>
        );
    } else if (location.pathname !== "/roles" && location.pathname !== "/groups") {
        return (
            <Box
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    position: "absolute",
                    right: 0,
                }}
            >
                <SaveButton sx={{ backgroundColor: "#0063cc" }} onClick={() => saveHandler()}>Save</SaveButton>
            </Box>
        );
    } else {
        return <></>;
    }
};
