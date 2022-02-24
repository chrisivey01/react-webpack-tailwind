import { TableCell, TableHead as MuiTableHead, TableRow } from "@mui/material";

interface Props {
    tableKey: any;
    tableValue: any;
}

export const TableHead = ({ tableKey, tableValue }: Props) => (
    <MuiTableHead>
        <TableRow>
            <TableCell
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
            >
                {tableKey}
            </TableCell>
            <TableCell
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
            >
                {tableValue}
            </TableCell>
        </TableRow>
    </MuiTableHead>
);
