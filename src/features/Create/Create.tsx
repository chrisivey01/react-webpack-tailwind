import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityGroupRole } from "../../../types/SecurityGroupRole";

import * as JSON from "../../assets/json";
import { creatorState, useCreator } from "../../recoil/atoms/creator";
import { groupState } from "../../recoil/atoms/groups";
import { rolesState } from "../../recoil/atoms/roles";
import { Creator } from "./components/Creator";
import { CreateRoleButton, CreateRoleContainer } from "./styles";

import {
    SecurityRole,
    SecurityRoleList,
    SecurityRoleResource,
    SecurityRoleResourceList,
    SecurityResourceList,
    SecurityResource,
} from "../../../types/SecurityRoleList";
import { appState } from "../../recoil/atoms/app";
import { httpRequestList } from "../../apis/requests";
import { SECURITY_ROLE_REQUEST } from "../../apis";

interface Props {
    setOpen: any;
    windowType: string;
}

export const Create = ({ setOpen, windowType }: Props) => {
    const location = useLocation();
    const app = useRecoilValue(appState);
    const roles = useRecoilValue(rolesState);
    const groups = useRecoilValue(groupState);
    const creator = useRecoilValue(creatorState);
    const setCreator = useCreator();

    const groupSelectHandler = (option: any, value: any) => {
        let securityGroupRoleSelected: SecurityGroupRole[] = [];

        value.forEach((sg: SecurityGroup) => {
            groups.groupsRoleMasterList.forEach((grml: SecurityGroupRole) => {
                if (sg.SECURITY_GROUP_UUID === grml.SECURITY_GROUP_UUID) {
                    securityGroupRoleSelected.push(grml);
                }
            });
        });

        let filteredRoles: SecurityRole[] = [];
        securityGroupRoleSelected.forEach((sgrs: SecurityGroupRole) => {
            groups.rolesMasterList.forEach((rml: SecurityRole) => {
                if (sgrs.SECURITY_ROLE_UUID === rml.SECURITY_ROLE_UUID) {
                    filteredRoles.push(rml);
                }
            });
        });
        setCreator((state) => ({
            ...state,
            rolesFiltered: filteredRoles,
        }));
    };

    const groupRoleSelectHandler = (option: any, rolesList: any) => {
        let resourceObj = Object.assign({}, rolesList[rolesList.length - 1]);
        resourceObj.ACTION_NAME = creator.action;
        rolesList[rolesList.length - 1] = resourceObj;
        setCreator((state) => ({ ...state, rolesFiltered: rolesList }));
    };

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

        setCreator((state) => ({
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
        resourceObj.securityAction = creator.actionSelected;
        if (creator.actionSelected) {
            resourceObj.resourceName =
                resourceObj.resourceName +
                " - " +
                creator.actionSelected.actionName.toUpperCase();
        }
        resourceList[resourceList.length - 1] = resourceObj;

        setCreator((state) => ({ ...state, resourcesFiltered: resourceList }));
    };

    const roleCreateHandler = () => {
        setOpen(false);
        let newRoleCopy = {...creator.role};
        newRoleCopy.securityAppEaiNbr = app.appId;
        newRoleCopy.securityRoleResourceList = creator.rolesFiltered;
        setCreator((state) => ({ ...state, role: newRoleCopy }));



    }

    return (
        <CreateRoleContainer>
            {location.pathname === "/roles" ? (
                <Typography sx={{ fontWeight: 600 }}>New Role</Typography>
            ) : (
                <Typography sx={{ fontWeight: 600 }}>New Group</Typography>
            )}

            {windowType === "role" ? (
                <Creator
                    firstMasterList={roles.rolesMasterList}
                    secondMasterList={roles.resourcesMasterList}
                    filteredList={creator.resourcesFiltered}
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
            ) : (
                <></>
            )}

            {windowType === "group" ? (
                <Creator
                    firstMasterList={groups.groupsMasterList}
                    secondMasterList={groups.rolesMasterList}
                    filteredList={creator.rolesFiltered}
                    firstClickHandler={groupSelectHandler}
                    secondClickHandler={groupRoleSelectHandler}
                    createdTextName={"Group Name"}
                    createdTextDescription={"Role Description"}
                    firstText={"Select Group to Copy"}
                    secondText={"Select Roles"}
                    firstPropDisplay={"groupName"}
                    secondPropLabel={"SECURITY_ROLE_UUID"}
                    secondPropDisplay={"roleName"}
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
                <CreateRoleButton onClick={() => roleCreateHandler()}>
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
