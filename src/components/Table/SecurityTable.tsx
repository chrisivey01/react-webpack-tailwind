import {
    Paper,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { Selector } from "./Selector";

interface Props {
    data: any[];
    name: string;
    value: string;
    headerKey: string;
    headerValue: string;
}

export const SecurityTable = ({
    data,
    name,
    value,
    headerKey,
    headerValue,
}: Props) => {
    const handleChange = (event: SelectChangeEvent) => {
        console.log(event.target.value);
    };

    const options = [
        {
            name: "VIEW",
            value: "view",
        },
        {
            name: "HAVE",
            value: "have",
        },
        {
            name: "ACCESS",
            value: "access",
        },
        {
            name: "EDIT",
            value: "edit",
        },
    ];

    return (
        <TableContainer
            sx={{ maxHeight: 440, marginTop: "10px" }}
            component={Paper}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                            }}
                        >
                            {headerKey}
                        </TableCell>
                        <TableCell
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                            }}
                        >
                            {headerValue}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((cl: any, index: number) => {
                        return (
                            <TableRow tabIndex={-1} key={index}>
                                <TableCell
                                    key={cl[name]}
                                    align={"left"}
                                    style={{
                                        fontSize: "12px",
                                    }}
                                >
                                    {cl[name]}
                                </TableCell>
                                <TableCell
                                    key={cl[value]}
                                    align={"left"}
                                    style={{
                                        fontSize: "12px",
                                    }}
                                >
                                    <Selector
                                        handleChange={handleChange}
                                        options={options}
                                        cl={cl}
                                        value={value}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
