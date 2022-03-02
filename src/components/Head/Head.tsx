import { AppBar, Box, Button, TextField, Toolbar } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        setUser((state) => ({ ...state, appId: "5907" }));
    }, []);

    return (
        <AppBar position="static" sx={{ background: "#4D148C" }}>
            <Toolbar>
                <Box sx={{ width: 80, height: 80 }}>
                    <img
                        src={fedexImg}
                        alt="Workflow"
                        style={{ height: "100%" }}
                    />
                </Box>
                <Box sx={{ position: "absolute", left: "10%" }}>
                    <TextField
                        value={app.appId}
                        sx={{

                            "& .MuiInputLabel-root.Mui-disabled": {
                                color: "#fff",
                                "-webkit-text-fill-color": "#fff",
                            },
                            "& .MuiOutlinedInput-input.Mui-disabled": {
                                color: "#fff",
                                "-webkit-text-fill-color": "#fff",
                                background: "rgba(0,0,0,.3)"
                            },
                        }}
                        label="Application ID"
                        margin="normal"
                        disabled
                    />
                </Box>
                <Box style={{ width: "100%" }}>
                    <Box
                        style={{ display: "flex", justifyContent: "flex-end" }}
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
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
