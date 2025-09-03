import * as React from "react"
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledTooltip = styled(MuiTooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderRadius: 8,
    fontSize: '0.875rem',
    padding: theme.spacing(2),
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    maxWidth: 280,
  },
  '& .MuiTooltip-arrow': {
    color: '#ffffff',
    '&::before': {
      border: '1px solid #e2e8f0',
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