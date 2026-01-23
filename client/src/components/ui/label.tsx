import * as React from "react"
import { FormLabel, FormLabelProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1,
  color: theme.palette.text.primary,
  '&.Mui-disabled': {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
}))

export interface LabelProps extends FormLabelProps {
  className?: string
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledFormLabel
        ref={ref}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }