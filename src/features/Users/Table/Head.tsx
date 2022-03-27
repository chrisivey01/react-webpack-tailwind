import { TableCell, TableHead as MuiTableHead, TableRow } from "@mui/material";

const Head = () => (
    <MuiTableHead>
        <TableRow>
            <TableCell
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
            >
                Resource
            </TableCell>
            <TableCell
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
            >
                Action
            </TableCell>
        </TableRow>
    </MuiTableHead>
);

export default Head;
