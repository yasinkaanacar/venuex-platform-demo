import * as React from "react"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  border: 'none',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: 0,
  minHeight: 'auto',
  '&.Mui-expanded': {
    minHeight: 'auto',
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    '&.Mui-expanded': {
      margin: 0,
    },
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    display: 'none',
  },
}))

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: 0,
}))

interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Collapsible = ({ open, onOpenChange, children }: CollapsibleProps) => {
  const [expanded, setExpanded] = React.useState(open || false)

  React.useEffect(() => {
    if (open !== undefined) {
      setExpanded(open)
    }
  }, [open])

  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded)
    if (onOpenChange) {
      onOpenChange(isExpanded)
    }
  }

  return (
    <StyledAccordion expanded={expanded} onChange={handleChange}>
      {children}
    </StyledAccordion>
  )
}

const CollapsibleTrigger = ({ children, ...props }: { children: React.ReactNode; className?: string }) => {
  return (
    <StyledAccordionSummary {...props}>
      <div>{children}</div>
    </StyledAccordionSummary>
  )
}

const CollapsibleContent = ({ children, ...props }: { children: React.ReactNode; className?: string }) => {
  return (
    <StyledAccordionDetails {...props}>
      {children}
    </StyledAccordionDetails>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }