import * as React from "react"
import { LoadingButton as MuiLoadingButton } from "@mui/lab"
import { styled } from "@mui/material/styles"
import type { ButtonProps } from "./button"

const StyledLoadingButton = styled(MuiLoadingButton)(({ theme }) => ({
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

export interface LoadingButtonProps extends Omit<ButtonProps, 'asChild'> {
  loading?: boolean
  loadingPosition?: 'start' | 'end' | 'center'
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ variant = 'default', size = 'default', loading = false, loadingPosition = 'center', ...props }, ref) => {
    const getMuiVariant = (): 'text' | 'outlined' | 'contained' => {
      switch (variant) {
        case 'default': return 'contained'
        case 'destructive': return 'contained'
        case 'outline': return 'outlined'
        case 'secondary': return 'contained'
        case 'ghost': return 'text'
        case 'link': return 'text'
        default: return 'contained'
      }
    }

    const getMuiSize = (): 'small' | 'medium' | 'large' => {
      switch (size) {
        case 'sm': return 'small'
        case 'lg': return 'large'
        case 'icon': return 'small'
        default: return 'medium'
      }
    }

    const getColor = (): 'inherit' | 'primary' | 'secondary' | 'error' => {
      switch (variant) {
        case 'destructive': return 'error'
        case 'secondary': return 'inherit'
        default: return 'primary'
      }
    }

    return (
      <StyledLoadingButton
        ref={ref}
        variant={getMuiVariant()}
        size={getMuiSize()}
        color={getColor()}
        loading={loading}
        loadingPosition={loadingPosition}
        {...props}
      />
    )
  }
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
