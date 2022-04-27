import { Box } from "@mui/material";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { SecurityRole } from "../../../../types/PhxUser";
import { SECURITY_ROLE_SAVE_REQUEST } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { Severity } from "../../../features/Notification/atom";
import { createRoleState, useCreateRole } from "../../../features/Roles/atoms/createRole";
import { rolesState, useRoles } from "../../../features/Roles/atoms/roles";
import { SaveButton } from "../styles";

type Props = {
    app: any;
    setNotification: any;
};

type SaveParams = {
    userId: string;
    securityRoleList: SecurityRole[];
};

const Roles = ({ app, setNotification }: Props) => {
    const role = useRecoilValue(rolesState);
    const setRoles = useRoles();
    const createRole = useRecoilValue(createRoleState);
    const setCreateRole = useCreateRole();
    const [checkedState, setCheckedState] = useState<any>(false);

    const saveHandler = async () => {

        let params = {
            userId: app.employee.employeeId,
            securityRoleList: [],
        } as SaveParams;
        params.securityRoleList.push(role.roleSelected);

        try {
            await httpRequestList(SECURITY_ROLE_SAVE_REQUEST, params);
            setNotification((state:any) => ({
                ...state,
                show: true,
                message: "Save Success!",
                severity: Severity.success,
            }));
        } catch (err: any) {
            setNotification((state:any) => ({
                ...state,
                show: true,
                message: err,
                severity: Severity.error,
            }));
        }
        setCreateRole((state) => ({
            ...state,
            createdPending: false,
            savePending: false
        }));
        setRoles((state) => ({
            ...state,
            savePending: false
        }))
    };

    const newRoleHandler = () => {
        setCreateRole((state) => ({
            ...state,
            show: true,
        }));
    };

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
                setNotification((state:any) => ({
                    ...state,
                    show: true,
                    message:
                        "You cannot add a resource until a role is selected.",
                    severity: Severity.error,
                }));
            }
        }
    };

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
                            backgroundColor: createRole.createdPending || role.savePending
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
};

export default Roles;