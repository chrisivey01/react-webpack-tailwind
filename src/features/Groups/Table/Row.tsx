import { Box, TableCell, TableRow } from "@mui/material";
import { useRecoilValue } from "recoil";
import { SecurityGroupResource } from "../../../../types/SecurityGroup";
import { groupState, useGroups } from "../atoms/groups";

type Props = {
    sgr: SecurityGroupResource;
    index: number;
};

const Row = ({ sgr, index }: Props) => {
    const group = useRecoilValue(groupState);
    const setGroups = useGroups();

    return (
        <TableRow tabIndex={-1}>
            <TableCell
                align={"left"}
                style={{
                    fontSize: "12px",
                    width: "770px",
                    color: sgr.color,
                    fontStyle: sgr.fontStyle,
                    fontWeight: sgr.fontSize,
                }}
            >
                <Box style={{ display: "flex", alignItems: "center" }}>
                    {sgr.securityResource.resourceName}
                </Box>
            </TableCell>
            <TableCell
                align={"left"}
                style={{
                    fontSize: "12px",
                    color: sgr.color,
                    fontStyle: sgr.fontStyle,
                    fontWeight: sgr.fontSize,
                }}
            >
                <Box>{sgr.securityAction.actionName}</Box>
            </TableCell>
        </TableRow>
    );
};

export default Row;
