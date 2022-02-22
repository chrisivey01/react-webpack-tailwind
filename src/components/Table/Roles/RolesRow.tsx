import {
    Box,
    IconButton,
    SelectChangeEvent,
    TableCell,
    TableRow,
} from "@mui/material";
import { Selector } from "../Selector";
import { RolesAutocomplete } from "./RolesAutocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { SecurityResource } from "../../../../types/SecurityResource";
import { updateResourceAction } from "../../../features/Roles/roles-slice";

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

    const actionSelectorHandler = (event: SelectChangeEvent) => {
        let copySelectedRow = JSON.parse(JSON.stringify(filteredResourceList));
        copySelectedRow[index].ACTION_NAME = event.target.value;
        copySelectedRow[index].COLOR = "yellow";
        dispatch(updateResourceAction(copySelectedRow));
    };

    const deleteHandler = (index: number) => {
        let copySelectedRow = JSON.parse(JSON.stringify(filteredResourceList));
        copySelectedRow[index].COLOR = "red";
        dispatch(updateResourceAction(copySelectedRow));
    };

    return (
        <TableRow tabIndex={-1} key={index}>
            <TableCell
                align={"left"}
                style={{
                    fontSize: "12px",
                    color: rowData.COLOR,
                }}
            >
                <Box style={{ display: "flex", alignItems: "center" }}>
                    {showHideDelete(true, index)}
                    <RolesAutocomplete
                        rowData={rowData}
                        autocompleteData={autocompleteData}
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
                <Selector
                    actionSelectorHandler={actionSelectorHandler}
                    rowData={rowData}
                />
            </TableCell>
        </TableRow>
    );
};
