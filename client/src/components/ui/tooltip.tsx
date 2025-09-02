import * as React from "react"
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledTooltip = styled(MuiTooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    borderRadius: 6,
    fontSize: '0.875rem',
    padding: theme.spacing(1, 1.5),
    border: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiTooltip-arrow': {
    color: theme.palette.grey[800],
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