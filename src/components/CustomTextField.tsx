import React, { forwardRef } from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";

type CustomTextFieldProps = TextFieldProps & {
  label: string;
  errorText?: string;
};

const CustomTextField = forwardRef(({ label, errorText, ...props }: CustomTextFieldProps, ref) => {
  return (
    <TextField
      {...props}
      inputRef={ref}
      label={label}
      error={!!errorText}
      helperText={errorText}
      variant="outlined"
      size="small"
      margin="dense"
      fullWidth
    />
  );
});

export default CustomTextField;