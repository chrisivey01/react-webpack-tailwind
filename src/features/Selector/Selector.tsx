import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { creatorState, useCreator } from "../../recoil/atoms/creator";
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
    const creator = useRecoilValue(creatorState);
    const setRoles = useRoles();
    const setCreator = useCreator();
    const actionOptionsTable: any = [
        {
            name: "VIEW",
            value: "view",
        },
        {
            name: "EDIT",
            value: "edit",
        },
        {
            name: "HAVE",
            value: "have",
        },
        {
            name: "ACCESS",
            value: "access",
        },
    ];

    const actionOptionsCreate: any = [
        {
            name: "VIEW",
            value: "view",
        },
        {
            name: "EDIT",
            value: "edit",
        },
    ]
    const actionSelectorHandler = (option: any) => {
        if (table && index) {
            let filteredResourceListCopy: any[] = [
                ...roles.filteredResourceList,
            ];
            let copyObj = Object.assign({}, filteredResourceListCopy[index]);
            copyObj.ACTION_NAME = option.target.value;
            copyObj.FONT_STYLE = "italic";
            copyObj.FONT_SIZE = 600;
            filteredResourceListCopy[index] = copyObj;
            setRoles((state) => ({
                ...state,
                filteredResourceList: filteredResourceListCopy,
            }));
        } else {
            setCreator((state) => ({ ...state, action: option.target.value }));
        }
    };

    // const resourceSelectHandler = (option: any, value: any) => {
    //     console.log(option)
    //     console.log(value)
    //     // let resourceObj = Object.assign(
    //     //     {},
    //     //     resourceList[resourceList.length - 1]
    //     // );
    //     // resourceObj.ACTION_NAME = actionSelected;
    //     // resourceList[resourceList.length - 1] = resourceObj;
    //     // dispatch(rolesSingleSelectHandler(resourceList));
    // };

    return (
        <FormControl>
            <Box style={{ display: "flex", alignItems: "center", margin: 8 }}>
                {rowData && rowData.ACTION_NAME ? (
                    <SelectAction
                        onChange={actionSelectorHandler}
                        value={rowData.ACTION_NAME.toLowerCase()}
                    >
                        {actionOptionsTable.map((option: any, index: number) => (
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
                        value={creator.action ?? ''}
                    >
                        {actionOptionsCreate.map((option: any, index: number) => (
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
