import * as React from "react"
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps, FormControlLabel } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  padding: 0,
  width: 16,
  height: 16,
  borderRadius: 2,
  '& .MuiSvgIcon-root': {
    fontSize: 16,
  },
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    opacity: 0.5,
  },
}))

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'size'> {
  className?: string
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledCheckbox
        ref={ref}
        size="small"
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }