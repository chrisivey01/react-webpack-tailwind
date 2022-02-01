import { Box, Container } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Groups } from "../../features/Groups";
import { Roles } from "../../features/Roles";
import { Users } from "../../features/Users";
import { UpdateButton } from "./styles";

export const Body = () => {
    const updateHandler = () => {
        console.log("11");
    };

    return (
        <>
            <Container style={{ minWidth: 1200 }}>
                <Box
                    style={{
                        minWidth: 1200,
                        position: "relative",
                    }}
                >
                    <UpdateButton onClick={() => updateHandler()}>
                        Update
                    </UpdateButton>
                </Box>
                <Routes>
                    <Route path="/" element={<Users />} />
                    <Route path="roles" element={<Roles />} />
                    <Route path="groups" element={<Groups />} />
                </Routes>
            </Container>
        </>
    );
};
