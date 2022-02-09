import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Nav } from "../../../types/Nav";
import fedexImg from "../../assets/fedex.png";

type Props = {
    navigation: any;
    navigateHandler: any;
};

export const Head = ({ navigateHandler, navigation }: Props) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <img
                    src={fedexImg}
                    alt="Workflow"
                    style={{ width: 80, height: 80 }}
                />
                <Box style={{ width: "100%" }}>
                    <Box
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        {navigation.map((nav: Nav, index: number) => (
                            <Button
                                key={index}
                                onClick={() => navigateHandler(nav.to)}
                                style={{
                                    display: "inline",
                                    borderRadius: 0,
                                    borderBottom: nav.current
                                        ? "3px solid #A004FF"
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
