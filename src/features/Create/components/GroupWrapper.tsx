import { Box } from "@mui/material";
import { useRecoilValue } from "recoil";
import { appState } from "../../../recoil/atoms/app";
import { creatorState, useCreator } from "../../../recoil/atoms/creator";
import { groupState } from "../../../recoil/atoms/groups";
import { CreateRoleButton } from "../styles";
import { Creator } from "../../Roles/Create/Creator";

export const GroupWrapper = () => {
    const app = useRecoilValue(appState);
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

    const groupCreateHandler = () => {
        let newRoleCopy = { ...creator.role };
        newRoleCopy.securityAppEaiNbr = app.appId;
        newRoleCopy.securityRoleResourceList = creator.rolesFiltered;
        setCreator((state) => ({ ...state, role: newRoleCopy, show: false }));
    };

    const groupNameHandler = (event: any) => {
        let groupFields = { ...creator.group };
        groupFields.roleName = event.target.value;
        setCreator((state) => ({ ...state, group: groupFields }));
    };

    const groupDescHandler = (event: any) => {
        let groupFields = { ...creator.group };
        groupFields.roleDesc = event.target.value;
        setCreator((state) => ({ ...state, group: groupFields }));
    };

    return (
        <>
            <Creator
                nameHandler={groupNameHandler}
                descHandler={groupDescHandler}
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
            <Box
                style={{
                    bottom: 10,
                    right: 10,
                    position: "absolute",
                }}
            >
                <CreateRoleButton onClick={() => groupCreateHandler()}>
                    Ok
                </CreateRoleButton>
                <CreateRoleButton
                    onClick={() =>
                        setCreator((state) => ({ ...state, show: false }))
                    }
                >
                    Cancel
                </CreateRoleButton>
                <CreateRoleButton>Reset</CreateRoleButton>
            </Box>
        </>
    );
};
