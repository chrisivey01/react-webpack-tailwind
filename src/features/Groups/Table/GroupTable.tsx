import {
    Paper,
    styled,
    TableBody,
    TableContainer,
    Table as MuiTable,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { SecurityGroupResource } from "../../../../types/SecurityGroup";
import { groupState } from "../atoms/groups";
import Head from "./Head";
import Row from "./Row";

const Table = styled(MuiTable)`
    .MuiTableCell-head {
        background-color: rgba(255, 255, 255) !important;
    }
`;

const GroupTable = () => {
    const scrollRef: any = useRef();
    const group = useRecoilValue(groupState);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.parentNode.scrollIntoView(0);
        }
    }, [scrollRef, group.groupSelected]);

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
                    {group.selectedGroup && group.selectedGroup.resourceByPriorityList &&
                        group.selectedGroup.resourceByPriorityList.map(
                            (sgr: SecurityGroupResource, index: number) => {
                                return (
                                    <Row
                                        key={index}
                                        index={index}
                                        sgr={sgr}
                                    />
                                );
                            }
                        )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default GroupTable;
