import {
  Paper,
  styled,
  Table as MuiTable,
  TableBody,
  TableContainer
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/users";
import Footer from "./Footer";
import Head from "./Head";
import Row from "./Row";

const Table = styled(MuiTable)`
  .MuiTableCell-head {
      background-color: rgba(255, 255, 255) !important;
  }
`;
export const UserTable = () => {
  const scrollRef: any = useRef();
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.parentNode.scrollIntoView(0);
    }
  }, [scrollRef, user.selectedUser]);

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
          {user.selectedUser?.resourceByPriorityList &&
            user.selectedUser?.resourceByPriorityList.map(
              (data: any, index: number) => {
                return (
                  <Row
                    key={index}
                    index={index}
                    sr={data}
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
