import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    IconButton,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { SecurityResource } from "../../../../types/SecurityResource";
import { rolesState, useRoles } from "../../Roles/atoms/roles";
import { Selector } from "../../Selector/Selector";
import { RolesAutocomplete } from "../../Roles/Table/RolesAutocomplete";

interface Props {
    index: number;
    autocompleteData: any;
    rowData: any;
    scrollRef?: any;
}

export const RolesRow = ({
    index,
    autocompleteData,
    rowData,
    scrollRef,
}: Props) => {
    const setRoles = useRoles();
    const roles = useRecoilValue(rolesState);
    const location = useLocation();

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
        let copySelectedRows = [...roles.filteredResourceList];
        let copyRow = Object.assign({}, copySelectedRows[index]);
        if (copyRow.COLOR === "red") {
            copyRow.COLOR = "black";
            copyRow.OPERATION_CODE = "VIEW";
        } else {
            copyRow.COLOR = "red";
            copyRow.OPERATION_CODE = "D";
        }
        copySelectedRows[index] = copyRow;
        setRoles((state) => ({
            ...state,
            filteredResourceList: copySelectedRows,
        }));
    };

    const newResourceDropdownHandler = (option: SecurityResource) => {
        let copySelectedRows = [...roles.filteredResourceList];
        let copyRow = Object.assign({}, option);
        copyRow.COLOR = "black";
        copyRow.FONT_STYLE = "italic";
        copyRow.FONT_SIZE = 600;
        copySelectedRows[index] = copyRow;
        setRoles((state) => ({
            ...state,
            filteredResourceList: copySelectedRows,
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

    return (
        <TableRow tabIndex={-1} key={index}>
            <TableCell
                align={"left"}
                style={{
                    fontSize: "12px",
                    width: "770px",
                    color: rowData.COLOR,
                    fontStyle: rowData.FONT_STYLE,
                    fontWeight: rowData.FONT_SIZE,
                }}
            >
                <Box style={{ display: "flex", alignItems: "center" }}>
                    <RolesAutocomplete
                        rowData={rowData}
                        autocompleteData={autocompleteData}
                        newResourceDropdownHandler={newResourceDropdownHandler}
                    />
                </Box>
            </TableCell>
            <TableCell
                align={"left"}
                style={{
                    fontSize: "12px",
                    color: rowData.COLOR,
                    fontStyle: rowData.FONT_STYLE,
                    fontWeight: rowData.FONT_SIZE,
                }}
            >
                <Box>{rowData.securityAction.actionName}</Box>
            </TableCell>
        </TableRow>
    );
};
