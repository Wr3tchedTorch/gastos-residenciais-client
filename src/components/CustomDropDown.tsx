import { MenuItem, TextField } from "@mui/material";
import React, { forwardRef } from "react";

type CustomDropDownProps = {
    label: string,
    name: string,
    values : Array<{value : string,label : string}>,
    errorText?: string;
    // changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void,
    // currentValue : string
}

const CustomDropDownField = forwardRef(({label, errorText, name, values, ...props }: CustomDropDownProps, ref) => {
    return (
        <TextField
            {...props}
            error={!!errorText}
            helperText={errorText}
            select
            label={label}
            name={name}
            inputRef={ref}

            variant="outlined"
            size="small"
            margin="dense"
        >
            {values.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
});

export default CustomDropDownField