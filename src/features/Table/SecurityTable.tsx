import {
    Paper,
    SelectChangeEvent,
    Table,
    TableBody, TableContainer
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { RolesRow } from "./Roles/RolesRow";
import { TableHead } from "./Roles/TableHead";

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
    headerKey,
    headerValue,
    securityResourceList,
}: Props) => {
    const location = useLocation();

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
