import * as React from "react"
import { Alert as MuiAlert, AlertTitle as MuiAlertTitle } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledAlert = styled(MuiAlert)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(2),
  fontSize: '0.875rem',
  '& .MuiAlert-icon': {
    marginRight: theme.spacing(1.5),
    alignSelf: 'flex-start',
    marginTop: 1,
  },
  '& .MuiAlert-message': {
    padding: 0,
  },
}))

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive'
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const getSeverity = () => {
      switch (variant) {
        case 'destructive':
          return 'error'
        default:
          return 'info'
      }
    }

    const { color, ...alertProps } = props
    return (
      <StyledAlert
        ref={ref}
        severity={getSeverity()}
        variant="outlined"
        {...alertProps}
      >
        {children}
      </StyledAlert>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        marginBottom: 4,
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.4,
      }}
      {...props}
    />
  )
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        fontSize: '0.875rem',
        lineHeight: 1.5,
      }}
      {...props}
    />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }