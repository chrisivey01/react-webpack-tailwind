import { FormControl, MenuItem, Select } from "@mui/material";

interface Props {
    cl: any;
    value: any;
    handleChange: any;
    options: any;
}

export const Selector = (props: Props) => {
    return (
        <FormControl>
            <Select
                value={String(props.cl[props.value]).toLowerCase()}
                onChange={props.handleChange}
                style={{fontSize: 12}}
            >
                {props.options.map((option: any, index: number) => (
                    <MenuItem key={index} value={option.value} style={{fontSize:12}}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
