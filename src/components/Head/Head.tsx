import { AppBar, Box, Button, TextField, Toolbar } from "@mui/material";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Nav } from "../../../types/Nav";
import fedexImg from "../../assets/fedex.png";
import { appState, useApp } from "../../recoil/atoms/app";

type Props = {
    navigation: any;
    navigateHandler: any;
};

export const Head = ({ navigateHandler, navigation }: Props) => {
    const app = useRecoilValue(appState);
    const setUser = useApp();

    useEffect(() => {
        const copyAppState = { ...app };
        copyAppState.appId = "5907";
        copyAppState.employee = {
            employeeId: "5252960",
            name: "Chris Ivey",
        };
        setUser(copyAppState);
    }, []);

    return (
        <AppBar
            position="static"
            sx={{ background: "#4D148C", minWidth: "700px" }}
        >
            <Toolbar>
                <Box sx={{ height: 80, width: "200px" }}>
                    <img
                        src={fedexImg}
                        alt="Workflow"
                        style={{ height: "100%" }}
                    />
                </Box>
                <Box sx={{ position: "absolute", left: "200px" }}>
                    <TextField
                        value={app.appId ?? ""}
                        sx={{
                            "& .MuiInputLabel-root.Mui-disabled": {
                                color: "#fff",
                                WebkitTextFillColor: "#fff",
                            },
                            "& .MuiOutlinedInput-input.Mui-disabled": {
                                color: "#fff",
                                WebkitTextFillColor: "#fff",
                                background: "rgba(0,0,0,.3)",
                            },
                        }}
                        label="Application ID"
                        margin="normal"
                        disabled
                    />
                </Box>
                <Box
                    style={{
                        width: "85%",
                        minWidth: "700px",
                        display: "flex",
                        justifyContent: "end",
                    }}
                >
                    {navigation.map((nav: Nav, index: number) => (
                        <Button
                            key={index}
                            onClick={() => navigateHandler(nav.to)}
                            style={{
                                color: "#fff",
                                display: "inline",
                                borderRadius: 0,
                                borderBottom: nav.current
                                    ? "3px solid #fff"
                                    : "",
                            }}
                        >
                            {nav.name}
                        </Button>
                    ))}
                    {app.employee ? (
                        <Box sx={{ position: "absolute", right: 10, top: 5 }}>
                            {app.employee.name}
                        </Box>
                    ) : (
                        <></>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};
