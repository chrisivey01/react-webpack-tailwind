import { Box, TableCell, TableRow } from "@mui/material";
import { useRecoilValue } from "recoil";
import { SecurityGroupResource } from "../../../../types/SecurityGroup";
import { SecurityResource, SecurityRoleResource } from "../../../../types/SecurityRole";
import { userState, useUser } from "../atoms/users";

type Props = {
    sr: SecurityRoleResource;
    index: number;
};

const Row = ({ sr, index }: Props) => {
    const user = useRecoilValue(userState);
    const setUser = useUser();

    if (sr.securityResource) {
        return (
            <TableRow tabIndex={-1}>
                <TableCell
                    align={"left"}
                    style={{
                        fontSize: "12px",
                        width: "770px",
                        color: sr.color,
                        fontStyle: sr.fontStyle,
                        fontWeight: sr.fontSize,
                    }}
                >
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        {sr.securityResource.resourceName}
                    </Box>
                </TableCell>
                <TableCell
                    align={"left"}
                    style={{
                        fontSize: "12px",
                        color: sr.color,
                        fontStyle: sr.fontStyle,
                        fontWeight: sr.fontSize,
                    }}
                >
                    <Box>{sr.securityAction?.actionName}</Box>
                </TableCell>
            </TableRow>
        );
    } else {
        return <></>;
    }
};

export default Row;
