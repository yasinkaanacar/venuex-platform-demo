import * as React from "react"
import { Card as MuiCard, CardContent as MuiCardContent, CardHeader as MuiCardHeader, CardActions as MuiCardActions } from "@mui/material"
import { styled } from "@mui/material/styles"

const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 8,
  border: `2px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[3],
}))

const CardHeader = styled(MuiCardHeader)(({ theme }) => ({
  padding: theme.spacing(3),
  '& .MuiCardHeader-title': {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  '& .MuiCardHeader-subheader': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  }
}))

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    }}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      fontSize: '0.875rem',
      color: 'rgba(0, 0, 0, 0.6)',
    }}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  }
}))

const CardFooter = styled(MuiCardActions)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: 0,
}))

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }