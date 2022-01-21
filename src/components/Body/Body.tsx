import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Groups } from "../../features/Groups";
import { Roles } from "../../features/Roles";
import { Users } from "../../features/Users";

export const Body = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Users />} />
                <Route path="roles" element={<Roles />} />
                <Route path="groups" element={<Groups />} />
            </Routes>
        </>
    );
};
