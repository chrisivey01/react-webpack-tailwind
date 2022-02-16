import {
    Autocomplete,
    Paper,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { Selector } from "./Selector";

interface Props {
    data?: any[];
    name: string;
    value: string;
    headerKey: string;
    headerValue: string;
    securityResourceList?: any;
}

export const SecurityTable = ({
    data,
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
            <Table size="small">
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
                                    align={"left"}
                                    style={{
                                        fontSize: "12px",
                                    }}
                                >
                                    {location.pathname === "/roles" ? (
                                        <Autocomplete
                                            size="small"
                                            sx={{ width: 500 }}
                                            id="tags-outlined"
                                            options={securityResourceList}
                                            getOptionLabel={(option) =>
                                                option.RESOURCE_NAME
                                            }
                                            value={cl}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    style={{ fontSize: 12 }}
                                                    margin="normal"
                                                />
                                            )}
                                        />
                                    ) : (
                                        <>{cl[name]}</>
                                    )}
                                </TableCell>
                                <TableCell
                                    align={"left"}
                                    style={{
                                        fontSize: "12px",
                                    }}
                                >
                                    {location.pathname === "/roles" ? (
                                        <Selector
                                            handleChange={handleChange}
                                            options={options}
                                            cl={cl}
                                            value={value}
                                        />
                                    ) : (
                                        <>{cl[name]}</>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
