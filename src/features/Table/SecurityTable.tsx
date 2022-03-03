import {
    Paper,
    styled,
    Table as MuiTable,
    TableBody,
    TableContainer,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { RolesRow } from "./Roles/RolesRow";
import { TableHead } from "./Roles/TableHead";

const Table = styled(MuiTable)`
    .MuiTableCell-head {
        background-color: rgba(255, 255, 255) !important;
    }
`;

interface Props {
    tableData?: any[];
    name: string;
    value: string;
    headerKey: string;
    headerValue: string;
    dataList?: any;
}

export const SecurityTable = ({
    tableData,
    headerKey,
    headerValue,
    dataList,
}: Props) => {
    return (
        <TableContainer
            sx={{ maxHeight: 440, marginTop: "10px" }}
            component={Paper}
        >
            <Table stickyHeader size="small">
                <TableHead tableKey={headerKey} tableValue={headerValue} />
                <TableBody>
                    {tableData &&
                        tableData.map((rowData: any, index: number) => {
                            return (
                                <RolesRow
                                    key={index}
                                    index={index}
                                    autocompleteData={dataList}
                                    rowData={rowData}
                                />
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
