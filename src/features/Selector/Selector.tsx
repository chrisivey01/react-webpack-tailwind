import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { actionSelectorCreate } from "../../deprecated/creator-slice";
import { updateResourceAction } from "../../deprecated/roles-slice";
import { useCreator } from "../../recoil/atoms/creator";
import { rolesState, useRoles } from "../../recoil/atoms/roles";

const SelectAction = styled(Select)`
    font-size: 12px;
    width: auto !important;
    min-width: 70px;
    margin-left: 3px;
    padding: 0px !important;

    .MuiInputBase-input {
        padding: 5px;
    }
`;

interface Props {
    rowData?: any;
    options?: any;
    table?: boolean;
    index?: number;
}

export const Selector = ({ rowData, table, index }: Props) => {
    const roles = useRecoilValue(rolesState);
    const setRoles = useRoles();
    const setCreator = useCreator();
    const actionOptions: any = [
        {
            name: "VIEW",
            value: "view",
        },
        {
            name: "EDIT",
            value: "edit",
        },
    ];
    const actionSelectorHandler = (option: any) => {
        if (table && index) {
            let filteredResourceListCopy: any[] = [
                ...roles.filteredResourceList,
            ];
            let copyObj = Object.assign({}, filteredResourceListCopy[index]);
            copyObj.ACTION_NAME = option.target.value;
            copyObj.COLOR = "yellow";
            filteredResourceListCopy[index] = copyObj;
            setRoles((state) => ({
                ...state,
                filteredResourceList: filteredResourceListCopy,
            }));
        } else {
            setCreator((state) => ({ ...state, action: option.target.value }));
        }
    };
    return (
        <FormControl>
            <Box style={{ display: "flex", alignItems: "center", margin: 8 }}>
                <Typography style={{ fontSize: 12 }}>
                    Action Selected:
                </Typography>
                {rowData && rowData.ACTION_NAME ? (
                    <SelectAction
                        onChange={actionSelectorHandler}
                        value={rowData.ACTION_NAME.toLowerCase()}
                    >
                        {actionOptions.map((option: any, index: number) => (
                            <MenuItem
                                key={index}
                                value={option.value}
                                style={{ fontSize: 12 }}
                            >
                                {option.name}
                            </MenuItem>
                        ))}
                    </SelectAction>
                ) : (
                    <SelectAction
                        onChange={actionSelectorHandler}
                        value={roles.actionSelected}
                    >
                        {actionOptions.map((option: any, index: number) => (
                            <MenuItem
                                key={index}
                                value={option.value}
                                style={{ fontSize: 12 }}
                            >
                                {option.name}
                            </MenuItem>
                        ))}
                    </SelectAction>
                )}
            </Box>
        </FormControl>
    );
};
