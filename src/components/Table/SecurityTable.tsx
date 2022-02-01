import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { SecurityRoleResource } from "../../../types/SecurityRoleResource";

interface Props {
    data: SecurityRoleResource[];
}
export const SecurityTable = ({ data }: Props) => {
    return (
        <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
            <Table>
                <TableHead>
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
                </TableHead>
                <TableBody>
                    {data.map((cl: SecurityRoleResource, index: number) => {
                        return (
                            <TableRow role="checkbox" tabIndex={-1} key={index}>
                                <TableCell
                                    key={cl.RESOURCE_NAME}
                                    align={"left"}
                                    style={{
                                        fontSize: "12px",
                                    }}
                                >
                                    {cl.RESOURCE_NAME}
                                </TableCell>
                                <TableCell
                                    key={cl.ACTION_NAME}
                                    align={"left"}
                                    style={{
                                        fontSize: "12px",
                                    }}
                                >
                                    {cl.ACTION_NAME}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
