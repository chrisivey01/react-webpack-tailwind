import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Nav } from "../../../types/Nav";
import fedexImg from "../../assets/fedex.png";

type Props = {
    navigation: any[];
};

export const Head = ({navigation}: Props) => {
    const navigate = useNavigate();
    return (
        <AppBar position="static">
            <Toolbar>
                <img
                    src={fedexImg}
                    alt="Workflow"
                    style={{width: 80, height: 80}}
                />
                <Box style={{width: "100%"}}>
                    <Box
                        style={{display: "flex", justifyContent: "flex-end"}}
                    >
                        {navigation.map((nav: Nav, index: number) => (
                            <Button
                                key={index}
                                onClick={() => navigate(nav.to)}
                                style={{color: "inherit"}}
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
