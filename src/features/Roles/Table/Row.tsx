import { Box, IconButton, TableCell, TableRow } from "@mui/material";
import { useRecoilValue } from "recoil";
import { RolesAutocomplete } from "./RolesAutocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import { rolesState, useRoles } from "../atom/roles";
import { Selector } from "../../Selector/Selector";
import { SecurityResource } from "../../../../types/SecurityRoleList";

type Props = {
    index: number;
    data: any;
};

export const Row = ({ index, data }: Props) => {
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
                rowData.securityAction.actionName === "Access" ||
                rowData.securityAction.actionName === "Have"
            ) {
                return <Box>{rowData.securityAction.actionName}</Box>;
            } else {
                return (
                    <Selector table={true} index={index} rowData={rowData} />
                );
            }
        } else {
            return <Selector table={true} index={index} rowData={rowData} />;
        }
    };

    const newResourceDropdownHandler = (option: SecurityResource) => {
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

        setRoles((state) => ({
            ...state,
            roleSelected: rolesCopy,
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
                align={"left"}
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
