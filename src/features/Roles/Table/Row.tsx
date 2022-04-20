import { Box, IconButton, TableCell, TableRow } from "@mui/material";
import { useRecoilValue } from "recoil";
import { RolesAutocomplete } from "./RolesAutocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import { rolesState, useRoles } from "../atoms/roles";
import { Selector } from "../../Selector/Selector";
import { SecurityResource } from "../../../../types/SecurityRole";
import { ActionList } from "../../../../types/ActionList";
import { httpRequestList } from "../../../apis/requests";
import { SECURITY_ACTION_REQUEST } from "../../../apis";
import { appState } from "../../../atom/app";

type Props = {
    index: number;
    data: any;
};

export const Row = ({ index, data }: Props) => {
    const app = useRecoilValue(appState);
    const roles = useRecoilValue(rolesState);
    const setRoles = useRoles();

    const showHideDelete = (show: boolean, index: number) => {
        if (show) {
            return (
                <IconButton size="small" onClick={() => deleteHandler(index)}>
                    <DeleteIcon />
                </IconButton>
            );
        } else {
            return <></>;
        }
    };

    const deleteHandler = (index: number) => {
        let rolesCopy = JSON.parse(JSON.stringify(roles.roleSelected));
        if (rolesCopy.securityRoleResourceList[index].color === "red") {
            rolesCopy.securityRoleResourceList[index].color = "black";
            rolesCopy.securityRoleResourceList[index].operationCd = "M";
            rolesCopy.operationCd = "M";
        } else {
            rolesCopy.securityRoleResourceList[index].color = "red";
            rolesCopy.securityRoleResourceList[index].operationCd = "D";
            rolesCopy.operationCd = "M";
        }

        setRoles((state) => ({
            ...state,
            roleSelected: rolesCopy,
        }));
    };

    const renderSelectOrText = (rowData: any, index: number) => {
        if (rowData.securityAction) {
            if (
                rowData.actionTypeName === "ACCESS_TYPE" ||
                rowData.actionTypeName === "HAVE_TYPE"
            ) {
                return <Box>{rowData.actionTypeName === "ACCESS_TYPE" ? "Access" : rowData.actionTypeName === "HAVE_TYPE" ? "Have" : <></>}</Box>;
            } else {
                return (
                    <Selector table={true} index={index} rowData={rowData} />
                );
            }
        } else {
            return <Selector table={true} index={index} rowData={rowData} />;
        }
    };

    const newResourceDropdownHandler = async (option: any) => {
        let rolesCopy = JSON.parse(JSON.stringify(roles.roleSelected));
        let filteredResourceListCopy = JSON.parse(
            JSON.stringify(roles.filteredResourceList)
        );

        filteredResourceListCopy.push(option);
        rolesCopy.securityRoleResourceList[
            index
        ].securityResource.resourceName = option.resourceName;
        
        rolesCopy.securityRoleResourceList[
            index
        ].securityResource.resourceDesc = option.resourceDesc;

        rolesCopy.securityRoleResourceList[
            index
        ].securityResource.actionTypeName = option.actionTypeName;
        
        
        rolesCopy.securityRoleResourceList[
            index
        ].securityResource.securityResourceUuid = option.securityResourceUuid;
        rolesCopy.securityRoleResourceList[index].securityResource.changeFlag =
            option.changeFlag;
        rolesCopy.securityRoleResourceList[
            index
        ].securityResource.securityAppEaiNbr = option.securityAppEaiNbr;
        rolesCopy.securityRoleResourceList[index].operationCd = "I";
        rolesCopy.securityRoleResourceList[index].color = "black";
        rolesCopy.securityRoleResourceList[index].fontStyle = "italic";
        rolesCopy.securityRoleResourceList[index].fontSize = 600;
        rolesCopy.securityRoleResourceList[index].newResource = true;
        rolesCopy.operationCd = "M";

        rolesCopy.securityRoleResourceList[index].actionTypeName = option.actionTypeName;
        const params = {
            securityAppEaiNbr: app.appId,
            userId: app.employee.employeeId,
            actionType: option.actionTypeName
        };
        const results: ActionList = await httpRequestList(
            SECURITY_ACTION_REQUEST,
            params
        );

        rolesCopy.securityRoleResourceList[index].securityAction = results.actionList[0]

        


        setRoles((state) => ({
            ...state,
            roleSelected: rolesCopy,
            savePending: true,
            filteredResourceList: filteredResourceListCopy,
        }));
    };

    return (
        <TableRow tabIndex={-1} key={index}>
            <TableCell
                align={"left"}
                style={{
                    fontSize: "12px",
                    width: "770px",
                    color: data.color,
                    fontStyle: data.fontStyle,
                    fontWeight: data.fontSize,
                }}
            >
                <Box style={{ display: "flex", alignItems: "center" }}>
                    {showHideDelete(true, index)}
                    <RolesAutocomplete
                        rowData={data}
                        newResourceDropdownHandler={newResourceDropdownHandler}
                    />
                </Box>
            </TableCell>
            <TableCell
                align={"center"}
                style={{
                    fontSize: "12px",
                    color: data.color,
                    fontStyle: data.fontStyle,
                    fontWeight: data.fontSize,
                }}
            >
                {renderSelectOrText(data, index)}
            </TableCell>
        </TableRow>
    );
};
