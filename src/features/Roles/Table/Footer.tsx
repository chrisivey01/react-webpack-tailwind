import { Box, TableFooter } from "@mui/material";
import { useRecoilValue } from "recoil";
import { rolesState } from "../atoms/roles";


function Footer() {
    const roles = useRecoilValue(rolesState);
    if (roles.roleSelected.securityRoleResourceList) {
        return (
            <TableFooter style={{ display: "flex", justifyContent: "flex-end" }}><Box style={{ fontSize: 11, padding: 5 }}>Resource Count: {roles.roleSelected.securityRoleResourceList.length}</Box></TableFooter>
        );
    } else {
        return <></>;
    }
}

export default Footer;