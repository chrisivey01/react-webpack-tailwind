import { Box, TableFooter } from "@mui/material";
import { useRecoilValue } from "recoil";
import { groupState } from "../atoms/groups";


function Footer() {
    const group = useRecoilValue(groupState);
    if (group.selectedGroup) {
        return (
            <TableFooter style={{ display: "flex", justifyContent: "flex-end" }}><Box style={{ fontSize: 11, padding: 5 }}>Resource Count: {group.selectedGroup.resourceByPriorityList.length}</Box></TableFooter>
        );
    } else {
        return <></>;
    }
}

export default Footer;