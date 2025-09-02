import * as React from "react"
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledButton = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: 6,
  fontSize: '0.875rem',
  minHeight: 40,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  gap: theme.spacing(1),
  '&.MuiButton-sizeSmall': {
    minHeight: 36,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    fontSize: '0.8125rem',
  },
  '&.MuiButton-sizeLarge': {
    minHeight: 44,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}))

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const getMuiVariant = (): 'text' | 'outlined' | 'contained' => {
      switch (variant) {
        case 'default':
          return 'contained'
        case 'destructive':
          return 'contained'
        case 'outline':
          return 'outlined'
        case 'secondary':
          return 'contained'
        case 'ghost':
          return 'text'
        case 'link':
          return 'text'
        default:
          return 'contained'
      }
    }

    const getMuiSize = (): 'small' | 'medium' | 'large' => {
      switch (size) {
        case 'sm':
          return 'small'
        case 'lg':
          return 'large'
        case 'icon':
          return 'small'
        default:
          return 'medium'
      }
    }

    const getColor = (): 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' => {
      switch (variant) {
        case 'destructive':
          return 'error'
        case 'secondary':
          return 'inherit'
        default:
          return 'primary'
      }
    }

    const buttonProps = {
      ...props,
      variant: getMuiVariant(),
      size: getMuiSize(),
      color: getColor(),
      ref,
    }

    if (size === 'icon') {
      buttonProps.style = {
        ...buttonProps.style,
        minWidth: 40,
        width: 40,
        height: 40,
      }
    }

    return <StyledButton {...buttonProps} />
  }
)
Button.displayName = "Button"

export { Button }