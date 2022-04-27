import {
    Paper,
    styled,
    Table as MuiTable,
    TableBody,
    TableContainer
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { rolesState } from "../atoms/roles";
import Footer from "./Footer";
import { Head } from "./Head";
import { Row } from "./Row";

const Table = styled(MuiTable)`
    .MuiTableCell-head {
        background-color: rgba(255, 255, 255) !important;
    }
`;
export const RoleTable = () => {
    const scrollRef: any = useRef();
    const roles = useRecoilValue(rolesState);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.parentNode.scrollIntoView(0);
        }
    }, [scrollRef, roles.roleSelected.securityRoleResourceList]);

    return (
        <TableContainer
            sx={{
                maxHeight: location.pathname !== "/roles" ? 320 : 440,
                marginTop: "10px",
            }}
            component={Paper}
        >
            <Table stickyHeader size="small">
                <Head />
                <TableBody ref={scrollRef}>
                    {roles.roleSelected.securityRoleResourceList &&
                        roles.roleSelected.securityRoleResourceList.map(
                            (data: any, index: number) => {
                                return (
                                    <Row
                                        key={index}
                                        index={index}
                                        data={data}
                                    />
                                );
                            }
                        )}
                </TableBody>
                <Footer />
            </Table>
        </TableContainer>
    );
};
