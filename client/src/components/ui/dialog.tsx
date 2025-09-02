import * as React from "react"
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions, DialogContentText, IconButton } from "@mui/material"
import { styled } from "@mui/material/styles"
import { X } from "lucide-react"

const StyledDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 8,
    padding: theme.spacing(2),
    maxWidth: 512,
    width: '100%',
  },
}))

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: '1.125rem',
  fontWeight: 600,
  lineHeight: 1.4,
  padding: theme.spacing(3, 3, 1, 3),
}))

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(1, 3),
}))

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3, 3),
  gap: theme.spacing(1),
  flexDirection: 'column-reverse',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}))

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  return (
    <StyledDialog open={open || false} onClose={handleClose}>
      {children}
    </StyledDialog>
  )
}

const DialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <>{children}</>
}

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return null // Material UI handles the overlay internally
  }
)
DialogOverlay.displayName = "DialogOverlay"

const DialogClose = ({ children, ...props }: { children?: React.ReactNode; className?: string }) => {
  return (
    <IconButton
      sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
      size="small"
      {...props}
    >
      {children || <X size={16} />}
    </IconButton>
  )
}

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      textAlign: 'center',
    }}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledDialogActions {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle_Custom = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <StyledDialogTitle ref={ref} {...props} />
  )
)
DialogTitle_Custom.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <DialogContentText ref={ref} sx={{ fontSize: '0.875rem', color: 'text.secondary' }} {...props} />
  )
)
DialogDescription.displayName = "DialogDescription"

const DialogContent_Custom = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <StyledDialogContent ref={ref} {...props}>
      {children}
    </StyledDialogContent>
  )
)
DialogContent_Custom.displayName = "DialogContent"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent_Custom as DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle_Custom as DialogTitle,
  DialogDescription,
}