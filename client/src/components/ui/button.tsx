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

// Create a buttonVariants function for compatibility with shadcn components
export const buttonVariants = (props?: { variant?: ButtonProps['variant']; size?: ButtonProps['size'] }) => {
  const variant = props?.variant || 'default';
  const size = props?.size || 'default';
  
  let baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  // Variant classes
  switch (variant) {
    case 'default':
      baseClasses += ' bg-primary text-primary-foreground hover:bg-primary/90';
      break;
    case 'destructive':
      baseClasses += ' bg-destructive text-destructive-foreground hover:bg-destructive/90';
      break;
    case 'outline':
      baseClasses += ' border border-input hover:bg-accent hover:text-accent-foreground';
      break;
    case 'secondary':
      baseClasses += ' bg-secondary text-secondary-foreground hover:bg-secondary/80';
      break;
    case 'ghost':
      baseClasses += ' hover:bg-accent hover:text-accent-foreground';
      break;
    case 'link':
      baseClasses += ' underline-offset-4 hover:underline text-primary';
      break;
  }
  
  // Size classes
  switch (size) {
    case 'sm':
      baseClasses += ' h-9 px-3';
      break;
    case 'lg':
      baseClasses += ' h-11 px-8';
      break;
    case 'icon':
      baseClasses += ' h-10 w-10';
      break;
    default:
      baseClasses += ' h-10 px-4 py-2';
      break;
  }
  
  return baseClasses;
};

export { Button }