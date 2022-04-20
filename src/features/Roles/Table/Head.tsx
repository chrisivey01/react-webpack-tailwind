import { TableCell, TableHead as MuiTableHead, TableRow } from "@mui/material";

export const Head = () => (
    <MuiTableHead >
        <TableRow>
            <TableCell
                style={{
                    paddingLeft: 25
                }}
            >
                Resource
            </TableCell>
            <TableCell align={"center"}
                style={{
                    paddingLeft: 25,
                }}
            >
                Action
            </TableCell>
        </TableRow>
    </MuiTableHead>
);
