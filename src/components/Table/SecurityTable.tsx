import {
    Autocomplete,
    IconButton,
    Paper,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
} from "@mui/material";

import { useLocation } from "react-router-dom";
import { Selector } from "./Selector";
import { RolesAutocomplete } from "./Roles/RolesAutocomplete";
import { TableHead } from "./Roles/TableHead";
import { RolesRow } from "./Roles/RolesRow";
import { useState } from "react";

interface Props {
    tableData?: any[];
    name: string;
    value: string;
    headerKey: string;
    headerValue: string;
    securityResourceList?: any;
}

export const SecurityTable = ({
    tableData,
    name,
    value,
    headerKey,
    headerValue,
    securityResourceList,
}: Props) => {
    const location = useLocation();
    const handleChange = (event: SelectChangeEvent) => {
        console.log(event.target.value);
    };
    const [selectedActions, setSelectedActions] = useState<any>("view");

    return (
        <TableContainer
            sx={{ maxHeight: 440, marginTop: "10px" }}
            component={Paper}
        >
            <Table size="small">
                <TableHead tableKey={headerKey} tableValue={headerValue} />
                <TableBody>
                    {tableData &&
                        tableData.map((rowData: any, index: number) => {
                            return (
                                <RolesRow
                                    key={index}
                                    index={index}
                                    autocompleteData={securityResourceList}
                                    rowData={rowData}
                                />
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
