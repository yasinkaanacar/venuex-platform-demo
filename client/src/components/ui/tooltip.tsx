import * as React from "react"
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledTooltip = styled(MuiTooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: 8,
    fontSize: '0.875rem',
    padding: theme.spacing(2),
    border: `2px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[3],
    maxWidth: 280,
  },
  '& .MuiTooltip-arrow': {
    color: theme.palette.background.paper,
    '&::before': {
      border: `2px solid ${theme.palette.divider}`,
    }
  },
}))

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const Tooltip = ({ children, title, ...props }: MuiTooltipProps) => {
  // Always wrap children in a span to ensure single element
  const wrappedChildren = React.createElement('span', { style: { display: 'inline-block' } }, children)
  
  return (
    <StyledTooltip title={title} {...props}>
      {wrappedChildren}
    </StyledTooltip>
  )
}

const TooltipTrigger = ({ children }: { children: React.ReactElement }) => {
  return children
}

const TooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }