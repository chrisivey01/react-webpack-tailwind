import { Box } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { PhxUser } from "../../../types/PhxUser";
import {
    SecurityResource
} from "../../../types/SecurityRole";
import { SECURITY_GROUP_SAVE_REQUEST, SECURITY_ROLE_SAVE_REQUEST, PHX_USER_SAVE_CONTROLLER } from "../../apis";
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
import { userState, useUser } from "../../features/Users/atoms/users";
import { SaveButton } from "./styles";

export const ActionButtons = () => {
    const location = useLocation();
    const [checkedState, setCheckedState] = useState<any>(false);
    const app = useRecoilValue(appState);
    const setNotification = useNotification();

    /**
     * user state
     */
    const user = useRecoilValue(userState);
    const setUser = useUser();


    /**
     * create role state
     */
    const createRole = useRecoilValue(createRoleState);
    const setCreateRole = useCreateRole();

    /**
     * role state
     */
    const role = useRecoilValue(rolesState);
    const setRoles = useRoles();


    /**
     * group state
     */
    const group = useRecoilValue(groupState);
    const setGroup = useGroups();
    const createGroup = useRecoilValue(createGroupState);
    const setCreateGroup = useCreateGroup();

    const clickHandler = (type: string) => {
        if (type === "create") {
            if (role.roleSelected) {
                let rolesCopy = JSON.parse(JSON.stringify(role.roleSelected));

                let securityObj: any = {
                    lastUpdUser: app.employee.employeeId,
                    securityAppEaiNbr: app.appId,
                    securityResource: {
                        changeFlag: "I",
                        resourceName: "",
                        resourceDesc: "",
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
        setCreateRole((state) => ({
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
            setCreateRole((state) => ({
                ...state,
                createdPending: false
            }));
        }

        if (location.pathname === "/groups") {

            params = {
                userId: app.employee.employeeId,
                securityGroupList: [],
            };

            params.securityGroupList.push(group.selectedGroup);

            if (createGroup.createdPending) {
                let copyGroupsMasterList = JSON.parse(JSON.stringify(group.groupsMasterList));
                copyGroupsMasterList.push({
                    groupName: group.selectedGroup?.groupName
                });
                setGroup((state: any) => ({
                    ...state,
                    groupsMasterList: copyGroupsMasterList
                }));
            }


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
            setCreateGroup((state) => ({
                ...state,
                createdPending: false
            }));
        };

        if (location.pathname === "/") {
            let userSelected: PhxUser = {
                activeFlg: user.selectedUser.activeFlg,
                allowableUrsaNetworksCds: user.selectedUser.allowableUrsaNetworksCds,
                altEffDaysView: user.selectedUser.altEffDaysView,
                carrierGrpCd: user.selectedUser.carrierGrpCd,
                ccRestrictedLeadDays: user.selectedUser.ccRestrictedLeadDays,
                companyNameCode: user.selectedUser.companyNameCode,
                defaultLegTypeCd: user.selectedUser.defaultLegTypeCd,
                emailId: user.selectedUser.emailId,
                fdxCompanyGrp: user.selectedUser.fdxCompanyGrp,
                guiUserPreferences: user.selectedUser.guiUserPreferences,
                inactiveUserStatus: user.selectedUser.inactiveUserStatus,
                lastLoginDtTm: user.selectedUser.lastLoginDtTm,
                lastUpdUser: user.selectedUser.lastUpdUser,
                metric: user.selectedUser.metric,
                oca: user.selectedUser.oca,
                smtpHost: user.selectedUser.smtpHost,
                userRouteTypeCd: user.selectedUser.userRouteTypeCd,
                userId: user.selectedUser.userId,
                emplNbr: user.selectedUser.emplNbr,
                firstName: user.selectedUser.firstName,
                lastName: user.selectedUser.lastName,
                operationCd: "M",
                resourceByPriorityList: user.acquiredResources,
                securityUserGroupList: user.acquiredGroups,
                securityUserRoleList: user.acquiredRoles
            };
            try {
                params = {
                    userId: app.employee.employeeId,
                    phxUserList: [userSelected],
                };
                await httpRequestList(PHX_USER_SAVE_CONTROLLER, params);
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
                console.log(err);
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
