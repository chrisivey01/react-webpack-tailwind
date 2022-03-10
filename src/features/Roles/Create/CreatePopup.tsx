import { Box } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
    SecurityResource,
    SecurityRole,
    SecurityRoleList,
    SecurityRoleListSaveList,
    SecurityRoleResource,
} from "../../../../types/SecurityRoleList";
import { SECURITY_ROLE_REQUEST } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { appState } from "../../../recoil/atoms/app";
import { rolesState } from "../atom/roles";
import { CreateRoleButton } from "../../Create/styles";
import { Creator } from "./Creator";
import { createRoleState, useCreateRole } from "../atom/createRole";

export const RoleWrapper = () => {
    const roles = useRecoilValue(rolesState);
    const app = useRecoilValue(appState);
    const setCreateRole = useCreateRole();
    const createRole = useRecoilValue(createRoleState);

    const roleSelectHandler = async (option: any, value: any) => {
        let roleList: string[] = [];
        value.map((opt: SecurityRole) => roleList.push(opt.roleName));
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
        if (securityRoleList) {
            securityRoleList.map((sr: SecurityRole) => {
                sr.securityRoleResourceList.map(
                    (srrl: SecurityRoleResource) => {
                        if (srrl.securityResource) {
                            resourcesSelected.push(srrl.securityResource);
                        }
                    }
                );
            });
        }

        setCreateRole((state) => ({
            ...state,
            resourcesFiltered: resourcesSelected,
            rolesFiltered: securityRoleList,
            rolesSelected: roleList,
        }));
    };

    const resourceSelectHandler = (
        option: any,
        resourceList: SecurityResource[]
    ) => {
        let resourceObj = { ...resourceList[resourceList.length - 1] };
        resourceObj.securityAction = createRole.actionSelected;
        if (createRole.actionSelected) {
            resourceObj.resourceName =
                resourceObj.resourceName +
                " - " +
                createRole.actionSelected.actionName.toUpperCase();
        }
        resourceList[resourceList.length - 1] = resourceObj;

        setCreateRole((state) => ({ ...state, resourcesFiltered: resourceList }));
    };

    const roleCreateHandler = () => {
        let saveList: SecurityRoleListSaveList;
        saveList = {
            securityRoleList: []
        }
        let newRoleCopy = { ...createRole.role };
        newRoleCopy.securityAppEaiNbr = app.appId;
        newRoleCopy.securityRoleResourceList = createRole.resourcesFiltered;
        saveList.securityRoleList.push(newRoleCopy);
        setCreateRole((state) => ({
            ...state,
            createdPending: true,
            securityRoleList: saveList,
            show: false,
        }));
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
                <CreateRoleButton>Reset</CreateRoleButton>
            </Box>
        </>
    );
};
