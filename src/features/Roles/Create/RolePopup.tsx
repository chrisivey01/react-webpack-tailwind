import { Box, Button, styled } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
    SecurityResource,
    SecurityRole,
    SecurityRoleList,
    SecurityRoleResource,
} from "../../../../types/SecurityRole";
import { SECURITY_ROLE_REQUEST } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { appState } from "../../../atom/app";
import { Severity, useNotification } from "../../Notification/atom";
import { createRoleState, useCreateRole } from "../atoms/createRole";
import { rolesState } from "../atoms/roles";
import { Creator } from "./Creator";


const CreateRoleButton = styled(Button)`
    margin: 5px;
    right: 0;
    color: rgb(255, 255, 255);
    box-shadow: none;
    text-transform: none;
    font-size: 12px;
    padding: 6px 12px;
    line-height: 1.5;
    background-color: #0063cc;
    border: 1px solid #0063cc;
    &:hover {
        background-color: #0069d9;
        border-color: #0062cc;
        box-shadow: none;
    }
    &:active {
        box-shadow: none;
        background-color: #0062cc;
        border-color: #005cbf;
    }
    &:focus {
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
    }
`;

export const RolePopup = () => {
    const roles = useRecoilValue(rolesState);
    const app = useRecoilValue(appState);
    const setCreateRole = useCreateRole();
    const createRole = useRecoilValue(createRoleState);
    const setNotification = useNotification();

    const roleSelectHandler = async (option: any, value: any) => {
        let roleList: string[] = [];
        value.map((opt: any) => {
            if (opt.roleName) {
                roleList.push(opt.roleName);
            } else {
                roleList.push(opt);
            }
        });
        const params = {
            fetchResources: true,
            roleNameList: roleList,
            securityAppEaiNbr: app.appId,
        };
        const results: SecurityRoleList = await httpRequestList(
            SECURITY_ROLE_REQUEST,
            params
        );
        let securityRoleList: SecurityRole[] = results.securityRoleList;
        let resourcesSelected: SecurityResource[] = [];
        let securityRoleResourceList: any[] = [];
        if (securityRoleList) {
            securityRoleList.map((sr: SecurityRole) => {
                if (sr.securityRoleResourceList) {
                    sr.securityRoleResourceList.map(
                        (srrl: SecurityRoleResource) => {
                            if (srrl.securityResource) {
                                let obj = {
                                    securityAppEaiNbr: app.appId,
                                    operationCd: "I",
                                    securityResource: srrl.securityResource,
                                    securityAction: srrl.securityAction,
                                };
                                resourcesSelected.push(srrl.securityResource);
                                securityRoleResourceList.push(obj);
                            }
                        }
                    );
                }
            });
        }

        setCreateRole((state) => ({
            ...state,
            securityRoleResourceList: securityRoleResourceList,
            resourcesFiltered: resourcesSelected,
            rolesFiltered: securityRoleList,
            rolesSelected: roleList,
        }));
    };

    const resourceSelectHandler = (
        option: any,
        resourceList: SecurityResource[]
    ) => {
        let copySecurityRoleResourceList = JSON.parse(
            JSON.stringify(createRole.securityRoleResourceList)
        );
        let resourceObj = { ...resourceList[resourceList.length - 1] };
        if (createRole.actionSelected) {
            resourceObj.securityAction = createRole.actionSelected;
            resourceObj.securityResource = {
                resourceName: resourceObj.resourceName,
                securityAppEaiNbr: app.appId,
                securityResourceUuid: resourceObj.securityResourceUuid,
                operationCd: "I",
            };
            /**
             * This edits display string last.
             */
            resourceObj.resourceName =
                resourceObj.resourceName +
                " - " +
                createRole.actionSelected.actionName.toUpperCase();
            resourceObj.operationCd = "I";
            resourceList[resourceList.length - 1] = resourceObj;
            copySecurityRoleResourceList.push(resourceObj);
            setCreateRole((state) => ({
                ...state,
                resourcesFiltered: resourceList,
                securityRoleResourceList: copySecurityRoleResourceList,
            }));
        } else {
            //notification needed for action needs selected
            setNotification((state) => ({
                ...state,
                show: true,
                message:
                    "You cannot add a resource manually, without an action selected.",
                severity: Severity.error,
            }));
        }
    };

    const roleCreateHandler = () => {
        let saveList: SecurityRole[] = [];
        let newRoleCopy: SecurityRole = { ...createRole.role };
        if (createRole.role) {
            newRoleCopy.securityAppEaiNbr = app.appId;
            newRoleCopy.securityRoleResourceList =
                createRole.securityRoleResourceList;
            newRoleCopy.operationCd = "I";
            newRoleCopy.roleName = createRole.role?.roleName;
            newRoleCopy.roleDesc = createRole.role?.roleDesc;
            saveList.push(newRoleCopy);
            setCreateRole((state) => ({
                ...state,
                createdPending: true,
                securityRoleList: saveList,
                show: false,
            }));
        }
    };

    const roleNameHandler = (event: any) => {
        let roleFields = { ...createRole.role };
        roleFields.roleName = event.target.value;
        setCreateRole((state) => ({ ...state, role: roleFields }));
    };

    const roleDescHandler = (event: any) => {
        let roleFields = { ...createRole.role };
        roleFields.roleDesc = event.target.value;
        setCreateRole((state) => ({ ...state, role: roleFields }));
    };

    return (
        <>
            <Creator
                nameHandler={roleNameHandler}
                descHandler={roleDescHandler}
                firstMasterList={roles.rolesMasterList}
                secondMasterList={roles.resourcesMasterList}
                filteredList={createRole.resourcesFiltered}
                firstClickHandler={roleSelectHandler}
                secondClickHandler={resourceSelectHandler}
                createdTextName={"Role Name"}
                createdTextDescription={"Role Description"}
                firstText={"Select Role to Copy"}
                secondText={"Select Resources"}
                firstPropDisplay={"roleName"}
                secondPropLabel={"securityResourceUuid"}
                secondPropDisplay={"resourceName"}
            />
            <Box
                style={{
                    bottom: 10,
                    right: 10,
                    position: "absolute",
                }}
            >
                <CreateRoleButton onClick={() => roleCreateHandler()}>
                    Ok
                </CreateRoleButton>
                <CreateRoleButton
                    onClick={() =>
                        setCreateRole((state) => ({ ...state, show: false }))
                    }
                >
                    Cancel
                </CreateRoleButton>
                <CreateRoleButton
                    onClick={() =>
                        setCreateRole((state) => ({
                            ...state,
                            rolesSelected: [],
                            resourcesFiltered: [],
                            securityRoleList: [],
                            actionSelected: undefined,
                            rolesFiltered: [],
                            securityRoleResourceList: [],
                            role: {
                                roleName: "",
                                roleDesc: "",
                            },
                        }))
                    }
                >
                    Reset
                </CreateRoleButton>
            </Box>
        </>
    );
};
