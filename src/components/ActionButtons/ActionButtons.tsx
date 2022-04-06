import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { appState } from "../../atom/app";
import {
    useNotification
} from "../../features/Notification/atom";
import Groups from "./components/Groups";
import Roles from "./components/Roles";
import Users from "./components/Users";

export const ActionButtons = () => {
    const location = useLocation();
    const app = useRecoilValue(appState);
    const setNotification = useNotification();

    if (location.pathname === "/roles") {
        return <Roles app={app} setNotification={setNotification} />;
    } else if (location.pathname === "/groups") {
        return <Groups app={app} setNotification={setNotification} />;
    } else if (location.pathname !== "/roles" && location.pathname !== "/groups") {
        return <Users app={app} setNotification={setNotification} />;
    } else {
        return <></>;
    }
};
