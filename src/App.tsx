import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { APP_EAI_LIST_REQUEST } from "./apis";
import { httpRequestList } from "./apis/requests";
import { Body } from "./components/Body";
import { Head } from "./components/Head";
import { GlobalStyle } from "./GlobalStyle";
import { appState, useApp } from "./recoil/atoms/app";

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const app = useRecoilValue(appState);
    const setApp = useApp();

    const [navigation, setNavigation]: any[] = useState([
        { name: "Users", to: "/", current: true },
        { name: "Groups", to: "/groups", current: false },
        { name: "Roles", to: "/roles", current: false },
    ]);

    /**
     * Obtain EAI List on load
     */


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

    useEffect(() => {
        let copyNavigate = [...navigation];
        copyNavigate.map((nav: any) => {
            if (nav.to === location.pathname) {
                nav.current = true;
            } else {
                nav.current = false;
            }
            return nav;
        });
        setNavigation(copyNavigate);
    }, [location.key]);

    return (
        <>
            <CssBaseline />
            <GlobalStyle />
            <Head navigateHandler={navigateHandler} navigation={navigation} />
            <Body />
        </>
    );
};

export default App;
