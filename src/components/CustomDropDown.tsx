import { MenuItem, TextField } from "@mui/material";
import React from "react";

type CustomDropDownProps = {
    label: string,
    name: string,
    changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void,
    values : Array<{value : string,label : string}>,
    currentValue : string
}

const CustomDropDownField = (props: CustomDropDownProps) => {
    return (
        <TextField
            select
            label={props.label}
            name={props.name}
            onChange={props.changeHandler}
            value={props.currentValue}

            variant={"outlined"}
            size={"small"}
            margin={"dense"}
        >
            {props.values.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default CustomDropDownField