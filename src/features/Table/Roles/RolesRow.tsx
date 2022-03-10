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
import { rolesState, useRoles } from "../../../recoil/atoms/roles";
import { Selector } from "../../Selector/Selector";
import { RolesAutocomplete } from "./RolesAutocomplete";

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

    // const actionSelectorHandler = (event: SelectChangeEvent) => {
    //     let copySelectedRows = JSON.parse(JSON.stringify(filteredResourceList));
    //     let copyRow = Object.assign({}, copySelectedRows[index]);
    //     copyRow.ACTION_NAME = event.target.value;
    //     copyRow.COLOR = "yellow";
    //     copySelectedRows[index] = copyRow;
    //     dispatch(updateResourceAction(copySelectedRows));
    // };

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

    if (location.pathname === "/roles") {
        return (
            <TableRow tabIndex={-1} key={index} ref={scrollRef}>
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
                        {showHideDelete(true, index)}
                        <RolesAutocomplete
                            rowData={rowData}
                            autocompleteData={autocompleteData}
                            newResourceDropdownHandler={
                                newResourceDropdownHandler
                            }
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
                    {rowData.securityAction.actionName === "Access" ||
                    rowData.securityAction.actionName === "Have" ? (
                        <Box>{rowData.securityAction.actionName}</Box>
                    ) : (
                        <Selector
                            table={true}
                            index={index}
                            rowData={rowData}
                        />
                    )}
                </TableCell>
            </TableRow>
        );
    } else {
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
                            newResourceDropdownHandler={
                                newResourceDropdownHandler
                            }
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
    }
};
