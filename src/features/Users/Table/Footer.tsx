import { Box, TableFooter } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/users";


function Footer() {
    const user = useRecoilValue(userState);
    if (user.acquiredResources && user.selectedUser?.resourceByPriorityList) {
        return (
            <TableFooter style={{ display: "flex", justifyContent: "flex-end", fontSize: 11, padding: 5 }}>Resource Count: {user.selectedUser?.resourceByPriorityList.length}</TableFooter>
        );
    } else {
        return <></>;
    }
}

export default Footer;