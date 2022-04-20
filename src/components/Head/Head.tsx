import {
    AppBar,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Toolbar,
} from "@mui/material";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ActionList } from "../../../types/ActionList";
import { EAI } from "../../../types/EAI";
import { EAIList } from "../../../types/EAIList";
import { Nav } from "../../../types/Nav";
import { APP_EAI_LIST_REQUEST, SECURITY_ACTION_REQUEST } from "../../apis";
import { httpRequestList } from "../../apis/requests";
import fedexImg from "../../assets/fedex.png";
import { appState, useApp } from "../../atom/app";

type Props = {
    navigation: any;
    navigateHandler: any;
};

export const Head = ({ navigateHandler, navigation }: Props) => {
    const app = useRecoilValue(appState);
    const setApp = useApp();

    useEffect(() => {
        const copyAppState = { ...app };
        copyAppState.appId = 5907;
        copyAppState.employee = {
            employeeId: "5259260",
            name: "Chris Ivey",
        };
        setApp(copyAppState);
    }, []);

    useEffect(() => {
        if (app.employee) {
            fetchEaiList();
            // fetchActionList();
        }
    }, [app.employee]);

    // const fetchActionList = async () => {
    //     const params = {
    //         securityAppEaiNbr: app.appId
    //     }
    //     const results: ActionList = await httpRequestList(
    //         SECURITY_ACTION_REQUEST,
    //         params
    //     )
    //     if(results){
    //         setApp((state) => ({
    //             ...state,
    //             actionList: results.actionList
    //         }))
    //     }
    // }

    const fetchEaiList = async () => {
        const params = {
            userId: app.employee.employeeId,
        };
        const results: EAIList = await httpRequestList(
            APP_EAI_LIST_REQUEST,
            params
        );
        if (results) {
            setApp((state) => ({
                ...state,
                appEaiList: results.appEaiList,
            }));
        }
    };


    const handleChange = () => {
        console.log("do nothing");
    };

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
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel sx={{ color: "white" }}>
                            EAI List
                        </InputLabel>
                        {app.appEaiList ? (
                            <Select
                                value={app.appEaiList[0].securityAppEaiNbr}
                                onChange={handleChange}
                                sx={{
                                    ".MuiInputLabel-root": {
                                        color: "white !important",
                                    },
                                    color: "white",
                                }}
                            >
                                {app.appEaiList.map((app: EAI, index: number) => {
                                    return (
                                        <MenuItem value={app.securityAppEaiNbr} key={index}>
                                            {app.securityAppEaiNbr} - {app.appName}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        ) : (
                            <></>
                        )}
                    </FormControl>
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
