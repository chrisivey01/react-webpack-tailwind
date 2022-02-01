import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { Body } from "./components/Body";
import { Head } from "./components/Head";
import { GlobalStyle } from "./GlobalStyle";
import { Nav } from "../types/Nav";
const App = () => {
    const navigation = [
        { name: "Users", to: "/", current: true },
        { name: "Groups", to: "/groups", current: false },
        { name: "Roles", to: "/roles", current: false },
    ];

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: "dark",
                },
            }),
        []
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyle />
            <Head navigation={navigation} />
            <Body />
        </ThemeProvider>
    );
};

export default App;
