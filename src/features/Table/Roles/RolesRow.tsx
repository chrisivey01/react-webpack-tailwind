import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    IconButton,
    SelectChangeEvent,
    TableCell,
    TableRow,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SecurityResource } from "../../../../types/SecurityResource";
import { SecurityRole } from "../../../../types/SecurityRole";
import {
    addNewResourceToList,
    updateResourceAction,
} from "../../Roles/roles-slice";
import { Selector } from "../../Selector/Selector";
import { RolesAutocomplete } from "./RolesAutocomplete";

interface Props {
    index: number;
    autocompleteData: any;
    rowData: any;
}

export const RolesRow = ({ index, autocompleteData, rowData }: Props) => {
    const dispatch = useDispatch();
    const filteredResourceList = useSelector(
        (state: any) => state.roles.filteredResourceList
    );
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
        let copySelectedRows = [...filteredResourceList];
        let copyRow = Object.assign({}, copySelectedRows[index]);
        copyRow.COLOR = "red";
        copyRow.OPERATION_CODE = "D";
        copySelectedRows[index] = copyRow;
        dispatch(updateResourceAction(copySelectedRows));
    };

    const newResourceDropdownHandler = (option: SecurityResource) => {
        let copySelectedRows = [...filteredResourceList];
        let copyRow = Object.assign({}, option);
        copyRow.COLOR = "yellow";
        copySelectedRows[index] = copyRow;
        dispatch(updateResourceAction(copySelectedRows));
    };

    return (
        <TableRow tabIndex={-1} key={index}>
            <TableCell
                align={"left"}
                style={{
                    fontSize: "12px",
                    color: rowData.COLOR,
                    width: "770px",
                }}
            >
                <Box style={{ display: "flex", alignItems: "center" }}>
                    {showHideDelete(true, index)}
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
                }}
            >
                <Selector table={true} index={index} rowData={rowData} />
            </TableCell>
        </TableRow>
    );
};
