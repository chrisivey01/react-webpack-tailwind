import { Box } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRoleList } from "../../../types/SecurityRoleList";
import { httpRequestList } from "../../apis/requests";
import { appState } from "../../recoil/atoms/app";
import { rolesState, useRoles } from "../../recoil/atoms/roles";
import { SaveButton } from "./styles";

interface Props {
    setWindowType: any;
    setOpen: any;
}

export const ActionButtons = ({ setWindowType, setOpen }: Props) => {
    const location = useLocation();
    const roles = useRecoilValue(rolesState);
    const setRoles = useRoles();
    const [checkedState, setCheckedState] = useState<any>(false);
    const create = useRecoilValue(creatorState);
    
    const clickHandler = (type: string) => {
        if (type === "create") {
            let resourceCopy = [...roles.filteredResourceList];
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
            setRoles((state) => ({
                ...state,
                filteredResourceList: resourceCopy,
            }));
        }
    };

    const closeHandler = () => {};

    const newRoleHandler = () => {
        setOpen(true);
        setWindowType("role");
    };

    const newGroupHandler = () => {
        setOpen(true);
        setWindowType("group");
    };

    const saveHandler = async () => {
        if (location.pathname === "/roles") {
            const results: SecurityRoleList = await httpRequestList(
                SECURITY_ROLE_SAVE_REQUEST,
                create.role
            );
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
                    <SaveButton>Modify</SaveButton>
                ) : (
                    <>
                        <SaveButton
                            disabled={roles.filteredResourceList === undefined}
                            onClick={() => clickHandler("create")}
                        >
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
function createState(createState: any) {
    throw new Error("Function not implemented.");
}

