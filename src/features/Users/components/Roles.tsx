import { Autocomplete, Box, Chip, TextField } from "@mui/material";
import { useRecoilValue } from "recoil";
import { SecurityRole, SecurityRoleList } from "../../../../types/SecurityRole";
import { RESOURCE_BY_PRIORITY_REQUEST, SECURITY_ROLE_REQUEST } from "../../../apis";
import { httpRequestList } from "../../../apis/requests";
import { appState } from "../../../atom/app";
import { userState, useUser } from "../atoms/users";

type Props = {};

const Roles = (props: Props) => {
    const setUser = useUser();
    const user = useRecoilValue(userState);
    const app = useRecoilValue(appState);

    const handleChangeRoles = async (option: any) => {
        let roleNames: string[] = [];
        let employee = JSON.parse(JSON.stringify(user.selectedUser));

        option.forEach((rn: any) => {
            if (rn.roleName) {
                roleNames.push(rn.roleName);
            } else {
                roleNames.push(rn);
            }
        });

        const params = {
            fetchResources: true,
            roleNameList: roleNames,
            securityAppEaiNbr: app.appId,
            userId: app.employee.employeeId
        };

        const srlResults: SecurityRoleList = await httpRequestList(
            SECURITY_ROLE_REQUEST,
            params
        );

        employee.securityUserRoleList = srlResults.securityRoleList;

        let getResourcePriority = {
            userId: app.employee.employeeId,
            operationCd: "I",
            roleList: srlResults.securityRoleList
        };
        const acquiredResources = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);


        /**
         * added
         * groupName
         */
        let copyAcquiredRoles = JSON.parse(JSON.stringify(srlResults.securityRoleList));
        copyAcquiredRoles.map((role: SecurityRole) => {
            let roleIndex = user.roleObj.findIndex((roleSearch: any) => (roleSearch.roleName === role.roleName));
            if (roleIndex !== -1) {
                role.added = false;
            } else {
                role.added = true;
            }
            return role;
        });

        setUser((state) => ({
            ...state,
            selectedUser: employee,
            acquiredResources: acquiredResources ? acquiredResources.resourceByPriorityList : [],
            acquiredRoles: copyAcquiredRoles
        }));
    };



    const handleDeleteRoles = async (option: any, index: number) => {
        let acquiredRolesCopy: any[] = JSON.parse(JSON.stringify(user.acquiredRoles));
        let employee = JSON.parse(JSON.stringify(user.selectedUser));
        let roleNames: any[] = [];

        employee.operationCd = "M";

        acquiredRolesCopy = JSON.parse(JSON.stringify(user.acquiredRoles));
        acquiredRolesCopy[index].deleted = !acquiredRolesCopy[index].deleted;

        if (acquiredRolesCopy[index].deleted) {
            acquiredRolesCopy[index].operationCd = "D";
        } else {
            acquiredRolesCopy[index].operationCd = "M";
        }

        roleNames = acquiredRolesCopy.filter((role) => !role.deleted);
        roleNames = roleNames.map((role) => role.roleName);

        if (roleNames.length > 0) {
            const params = {
                fetchResources: true,
                roleNameList: roleNames,
                securityAppEaiNbr: app.appId,
                userId: app.employee.employeeId
            };

            const srlResults: SecurityRoleList = await httpRequestList(
                SECURITY_ROLE_REQUEST,
                params
            );

            employee.securityUserRoleList = acquiredRolesCopy;

            let getResourcePriority = {
                userId: app.employee.employeeId,
                operationCd: "I",
                roleList: srlResults.securityRoleList
            };

            const acquiredResources = await httpRequestList(RESOURCE_BY_PRIORITY_REQUEST, getResourcePriority);

            setUser((state) => ({
                ...state,
                selectedUser: employee,
                acquiredResources: acquiredResources ? acquiredResources.resourceByPriorityList : [],
                acquiredRoles: acquiredRolesCopy
            }));
        } else {
            setUser((state) => ({
                ...state,
                acquiredResources: [],
            }));
        }
    };

    return (
        <Box sx={{ padding: "10px" }}>
            <Autocomplete
                filterSelectedOptions
                size="small"
                sx={{
                    maxHeight: 220,
                    width: 570,
                    maxWidth: 570,
                    overflow: "auto",
                }}
                multiple
                id="tags-outlined"
                options={user.rolesMasterList ?? []}
                getOptionLabel={(option: any) => option.roleName ?? option}
                isOptionEqualToValue={(option: any, value: any) =>
                    option.roleName === value.roleName
                }
                renderTags={(value: any, getTagProps: any) =>
                    value.map(
                        (option: any, index: any) => (
                            <Chip
                                key={index}
                                variant="outlined"
                                clickable
                                onDelete={() => handleDeleteRoles(option, index)}
                                label={option.roleName}
                                style={{
                                    margin: "2px",
                                    color: option.deleted ? "red" : "unset",
                                    fontStyle: option.added
                                        ? "italic"
                                        : "normal",
                                    fontWeight: option.added
                                        ? 600
                                        : 100,
                                }}
                            />
                        )
                    )
                }
                onChange={(e, option: any) =>
                    handleChangeRoles(option)
                }
                value={user.acquiredRoles ?? []}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="User Roles"
                        style={{ fontSize: 12 }}
                        margin="normal"
                    />
                )}
            />
        </Box>
    );
};

export default Roles;