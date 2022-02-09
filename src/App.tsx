import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Body } from "./components/Body";
import { Head } from "./components/Head";
import { GlobalStyle } from "./GlobalStyle";

const App = () => {
    const navigate = useNavigate();

    const [navigation, setNavigation]: any[] = useState([
        { name: "Users", to: "/", current: true },
        { name: "Groups", to: "/groups", current: false },
        { name: "Roles", to: "/roles", current: false },
    ]);

    const navigateHandler = (to: string) => {
        navigation.map((nav: any) => {
            nav.current = false;
            return nav;
        });

        navigation.map((nav: any) => {
            if (nav.to === to) {
                nav.current = true;
            }
            return nav;
        });
        navigate(to);
        setNavigation(navigation);
    };

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
            <Head navigateHandler={navigateHandler} navigation={navigation} />
            <Body />
        </ThemeProvider>
    );
};

export default App;
