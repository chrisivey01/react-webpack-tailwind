import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { SecurityGroup } from "../../../types/SecurityGroup";
import { SecurityGroupRole } from "../../../types/SecurityGroupRole";
import { SecurityResource } from "../../../types/SecurityResource";
import { SecurityRole } from "../../../types/SecurityRole";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";
import * as JSON from "../../assets/json";
import { creatorState, useCreator } from "../../recoil/atoms/creator";
import { groupState } from "../../recoil/atoms/groups";
import { rolesState } from "../../recoil/atoms/roles";
import { Creator } from "./components/Creator";
import { CreateRoleButton, CreateRoleContainer } from "./styles";

interface Props {
    setOpen: any;
    windowType: string;
}

export const Create = ({setOpen, windowType}: Props) => {
    const location = useLocation();
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
            rolesFiltered:filteredRoles,
        }));
    };

    const groupRoleSelectHandler = (option: any, rolesList: any) => {
        let resourceObj = Object.assign(
            {},
            rolesList[rolesList.length - 1]
        );
        resourceObj.ACTION_NAME = creator.action;
        rolesList[rolesList.length - 1] = resourceObj;
        setCreator((state) => ({...state, rolesFiltered:rolesList}));
    };

    const roleSelectHandler = (option: any, value: any) => {
        const roleList = value.reverse();
        let securityRoleResourceList: SecurityRoleResource[] =
            JSON.securityRoleResourceJson;

        let filteredSecurityRoleResourceList: any[] = [];
        roleList.forEach((rs: SecurityRole) => {
            securityRoleResourceList.forEach(
                (securityRoleResource: SecurityRoleResource) => {
                    if (
                        securityRoleResource.SECURITY_ROLE_UUID ===
                        rs.SECURITY_ROLE_UUID
                    ) {
                        let rsCopy = Object.assign({}, rs);
                        rsCopy.SECURITY_RESOURCE_UUID =
                            securityRoleResource.SECURITY_RESOURCE_UUID;
                        filteredSecurityRoleResourceList.push(rsCopy);
                    }
                }
            );
        });

        console.log(filteredSecurityRoleResourceList);

        let securityResourceFilteredList: SecurityResource[] = [
            ...creator.resourcesFiltered,
        ];

        filteredSecurityRoleResourceList.map((fsrrl: SecurityRoleResource) => {
            roles.resourcesMasterList.map((srl: SecurityResource) => {
                if (
                    srl.SECURITY_RESOURCE_UUID === fsrrl.SECURITY_RESOURCE_UUID
                ) {
                    if (securityResourceFilteredList.length === undefined) {
                        let srlCopy = Object.assign({}, srl);
                        srlCopy.SECURITY_ACTION_UUID =
                            fsrrl.SECURITY_ACTION_UUID;
                        securityResourceFilteredList.push(srlCopy);
                    } else {
                        let srflIndex = securityResourceFilteredList.findIndex(
                            (srlIndx: SecurityResource) =>
                                srlIndx.SECURITY_RESOURCE_UUID ===
                                srl.SECURITY_RESOURCE_UUID
                        );
                        if (srflIndex === -1) {
                            let srlCopy = Object.assign({}, srl);
                            srlCopy.SECURITY_ACTION_UUID =
                                fsrrl.SECURITY_ACTION_UUID;
                            securityResourceFilteredList.push(srlCopy);
                        }
                    }
                }
            });
        });

        securityResourceFilteredList.map((srl: SecurityResource) => {
            if (!srl.ACTION_NAME) {
                let srlCopy = Object.assign(srl, {});
                srlCopy.ACTION_NAME = creator.action;
                srlCopy.RESOURCE_NAME =
                    srlCopy.RESOURCE_NAME +
                    " - " +
                    creator.action.toUpperCase();
                return srlCopy;
            } else {
                return srl;
            }
        });

        setCreator((state) => ({
            ...state,
            resourcesFiltered:securityResourceFilteredList,
            rolesSelected:roleList,
        }));
    };

    const resourceSelectHandler = (option: any, resourceList: any) => {
        let resourceObj = Object.assign(
            {},
            resourceList[resourceList.length - 1]
        );
        resourceObj.ACTION_NAME = creator.action;
        resourceList[resourceList.length - 1] = resourceObj;
        setCreator((state) => ({...state, resourcesFiltered:resourceList}));
    };

    return (
        <CreateRoleContainer>
            {location.pathname === "/roles" ? (
                <Typography sx={{fontWeight:600}}>New Role</Typography>
            ) : (
                <Typography sx={{fontWeight:600}}>New Group</Typography>
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
                    firstPropDisplay={"ROLE_NAME"}
                    secondPropLabel={"SECURITY_RESOURCE_UUID"}
                    secondPropDisplay={"RESOURCE_NAME"}
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
                    firstPropDisplay={"GROUP_NAME"}
                    secondPropLabel={"SECURITY_ROLE_UUID"}
                    secondPropDisplay={"ROLE_NAME"}
                />
            ) : (
                <></>
            )}
            <Box
                style={{
                    bottom:10,
                    right:10,
                    position:"absolute",
                }}
            >
                <CreateRoleButton onClick={() => setOpen(false)}>
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
