import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export interface PopoverSelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export interface PopoverSelectProps {
  options: PopoverSelectOption[]
  value: string
  onValueChange: (value: string) => void
  triggerLabel?: string
  placeholder?: string
  className?: string
  popoverWidth?: string
  "data-testid"?: string
}

export function PopoverSelect({
  options,
  value,
  onValueChange,
  triggerLabel,
  placeholder = "Select...",
  className,
  popoverWidth = "w-[200px]",
  "data-testid": testId,
}: PopoverSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((o) => o.value === value)
  const displayText = selectedOption?.label || placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          data-testid={testId}
          className={cn(
            "inline-flex items-center justify-between gap-2 h-9 px-3 text-sm",
            "border border-gray-200 rounded-md bg-white",
            "hover:bg-gray-50 hover:border-gray-300",
            "transition-colors cursor-pointer whitespace-nowrap",
            open && "ring-2 ring-blue-200 border-blue-300",
            className
          )}
        >
          <div className="flex flex-col items-start">
            {triggerLabel && (
              <span className="text-[10px] font-medium text-gray-500 leading-none">
                {triggerLabel}
              </span>
            )}
            <span className="text-sm text-gray-900 leading-tight">
              {displayText}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(popoverWidth, "p-1")}
        align="start"
        sideOffset={6}
      >
        <div className="space-y-0.5">
          {options.map((option) => {
            const isActive = option.value === value
            return (
              <button
                key={option.value}
                onClick={() => {
                  onValueChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {option.icon && (
                  <span className="shrink-0 text-gray-500">{option.icon}</span>
                )}
                <span className="flex-1 text-left">{option.label}</span>
                {isActive && (
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
