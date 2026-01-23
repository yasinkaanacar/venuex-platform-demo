import * as React from "react"
import { TextField, TextFieldProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 6,
    backgroundColor: theme.palette.background.paper,
    fontSize: '0.875rem',
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.75rem',
  },
}))

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledTextField
        variant="outlined"
        size="small"
        fullWidth
        inputRef={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }