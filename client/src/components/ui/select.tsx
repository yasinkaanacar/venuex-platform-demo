import * as React from "react"
import { FormControl, Select as MuiSelect, MenuItem, FormHelperText, InputLabel, SelectProps as MuiSelectProps } from "@mui/material"
import { styled } from "@mui/material/styles"
import { Check, ChevronDown } from "lucide-react"

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 6,
    fontSize: '0.875rem',
    minHeight: 40,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
}))

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  '& .MuiSelect-icon': {
    color: theme.palette.text.secondary,
  },
}))

interface SelectProps extends Omit<MuiSelectProps, 'children'> {
  children?: React.ReactNode
  placeholder?: string
  onValueChange?: (value: string) => void
  value?: string
  defaultValue?: string
}

const Select = ({ children, onValueChange, ...props }: SelectProps) => {
  const handleChange = (event: any) => {
    if (onValueChange) {
      onValueChange(event.target.value)
    }
    if (props.onChange) {
      props.onChange(event, event.target)
    }
  }

  // Extract MenuItem children from nested structure
  const extractMenuItems = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === SelectContent) {
          return extractMenuItems(child.props.children)
        }
        return child
      }
      return child
    })
  }

  return (
    <StyledFormControl size="small" fullWidth>
      <StyledSelect 
        {...props} 
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => (selected as string) || props.placeholder || ''}
      >
        {extractMenuItems(children)}
      </StyledSelect>
    </StyledFormControl>
  )
}

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const SelectItem = React.forwardRef<
  HTMLLIElement,
  { value: string; children: React.ReactNode; className?: string }
>(({ value, children, ...props }, ref) => (
  <MenuItem value={value} ref={ref} {...props}>
    {children}
  </MenuItem>
))
SelectItem.displayName = "SelectItem"

const SelectTrigger = ({ children, ...props }: { children: React.ReactNode; className?: string }) => {
  return <>{children}</>
}

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return null // This is handled by Material UI Select internally
}

const SelectGroup = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const SelectLabel = ({ children, ...props }: { children: React.ReactNode }) => {
  return <InputLabel {...props}>{children}</InputLabel>
}

const SelectSeparator = () => {
  return <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}