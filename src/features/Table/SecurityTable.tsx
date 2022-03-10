// import {
//     Box,
//     Button,
//     Paper,
//     styled,
//     Table as MuiTable,
//     TableBody,
//     TableContainer,
//     TableFooter,
// } from "@mui/material";
// import { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { RolesRow } from "./Roles/RolesRow";
// import { TableHead } from "./Roles/TableHead";

// const Table = styled(MuiTable)`
//     .MuiTableCell-head {
//         background-color: rgba(255, 255, 255) !important;
//     }
// `;

// interface Props {
//     tableData?: any[];
//     name: string;
//     value: string;
//     headerKey: string;
//     headerValue: string;
//     dataList?: any;
// }

// export const SecurityTable = ({
//     tableData,
//     headerKey,
//     headerValue,
//     dataList,
// }: Props) => {
//     const location = useLocation();
//     const scrollRef: any = useRef();

//     useEffect(() => {
//         if (scrollRef.current) {
//             scrollRef.current.parentNode.scrollIntoView(0);
//         }
//     }, [scrollRef, tableData]);

//     return (
//         <TableContainer
//             sx={{
//                 maxHeight: location.pathname !== "/roles" ? 320 : 440,
//                 marginTop: "10px",
//             }}
//             component={Paper}
//         >
//             <Table stickyHeader size="small">
//                 <TableHead tableKey={headerKey} tableValue={headerValue} />
//                 <TableBody ref={scrollRef}>
//                     {tableData &&
//                         tableData.map((rowData: any, index: number) => {
//                             if (index === tableData.length) {
//                                 return (
//                                     <RolesRow
//                                         key={index}
//                                         index={index}
//                                         autocompleteData={dataList}
//                                         rowData={rowData}
//                                     />
//                                 );
//                             } else {
//                                 return (
//                                     <RolesRow
//                                         key={index}
//                                         index={index}
//                                         autocompleteData={dataList}
//                                         rowData={rowData}
//                                     />
//                                 );
//                             }
//                         })}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// };
