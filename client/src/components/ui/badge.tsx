import * as React from "react"
import { Chip, ChipProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledChip = styled(Chip)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  height: 'auto',
  borderRadius: 9999,
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(1.25),
  paddingRight: theme.spacing(1.25),
  '& .MuiChip-label': {
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    padding: 0,
    gap: 0,
  },
  // Prevent MUI hover/focus overrides when custom bg colors are set via className
  '&:hover': {
    backgroundColor: 'inherit',
  },
}))

export interface BadgeProps extends Omit<ChipProps, 'variant' | 'children'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children?: React.ReactNode
}

function Badge({ variant = 'default', children, ...props }: BadgeProps) {
  const getChipVariant = (): 'filled' | 'outlined' => {
    switch (variant) {
      case 'outline':
        return 'outlined'
      default:
        return 'filled'
    }
  }

  const getColor = (): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (variant) {
      case 'destructive':
        return 'error'
      case 'secondary':
        return 'default'
      default:
        return 'primary'
    }
  }

  return (
    <StyledChip
      variant={getChipVariant()}
      color={getColor()}
      label={children}
      {...props}
    />
  )
}

export { Badge }