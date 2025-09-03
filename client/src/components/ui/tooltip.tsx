import * as React from "react"
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledTooltip = styled(MuiTooltip)(() => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: 'white !important',
    color: 'black !important',
    borderRadius: '8px',
    fontSize: '14px',
    padding: '16px',
    border: '1px solid white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    maxWidth: '280px',
  },
  '& .MuiTooltip-arrow': {
    color: 'white !important',
    '&::before': {
      backgroundColor: 'white !important',
      border: '1px solid white !important',
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