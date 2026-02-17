import * as React from "react"
import { X, ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/contexts/LanguageContext"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

export interface MultiSelectOption {
  value: string
  label: string
  description?: string
}

export interface MultiSelectComboboxProps {
  options: MultiSelectOption[]
  selected: string[]
  onSelectionChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  triggerLabel?: string
  triggerIcon?: React.ReactNode
  maxDisplayBadges?: number
  className?: string
  popoverWidth?: string
  "data-testid"?: string
}

export function MultiSelectCombobox({
  options,
  selected,
  onSelectionChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  triggerLabel,
  triggerIcon,
  maxDisplayBadges = 2,
  className,
  popoverWidth = "w-[340px]",
  "data-testid": testId,
}: MultiSelectComboboxProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)

  const resolvedPlaceholder = placeholder ?? t.filters.allLocations
  const resolvedSearchPlaceholder = searchPlaceholder ?? t.filters.searchLocations
  const resolvedEmptyMessage = emptyMessage ?? t.filters.noLocationsFound

  const toggleItem = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter((v) => v !== value))
    } else {
      onSelectionChange([...selected, value])
    }
  }

  const removeItem = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectionChange(selected.filter((v) => v !== value))
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  const selectedOptions = options.filter((o) => selected.includes(o.value))
  const visibleBadges = selectedOptions.slice(0, maxDisplayBadges)
  const overflowCount = selectedOptions.length - maxDisplayBadges

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          data-testid={testId}
          className={cn(
            "inline-flex items-center gap-2 h-9 px-3 text-sm",
            "border border-gray-200 rounded-md bg-white",
            "hover:bg-gray-50 hover:border-gray-300",
            "transition-colors cursor-pointer",
            open && "ring-2 ring-blue-200 border-blue-300",
            className
          )}
        >
          {triggerIcon && (
            <span className="text-gray-400 shrink-0">{triggerIcon}</span>
          )}

          {selected.length === 0 ? (
            <div className="flex flex-col items-start">
              {triggerLabel && (
                <span className="text-[10px] font-medium text-gray-500 leading-none">
                  {triggerLabel}
                </span>
              )}
              <span className="text-sm text-gray-500 leading-tight">
                {resolvedPlaceholder}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 max-w-[260px] overflow-hidden">
              {visibleBadges.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 h-5 px-1.5 text-[11px] font-medium bg-gray-100 text-gray-700 rounded shrink-0"
                >
                  {opt.value}
                  <X
                    className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={(e) => removeItem(opt.value, e)}
                  />
                </span>
              ))}
              {overflowCount > 0 && (
                <span className="text-[11px] text-gray-500 font-medium shrink-0">
                  +{overflowCount}
                </span>
              )}
            </div>
          )}

          <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(popoverWidth, "p-0")}
        align="start"
        sideOffset={6}
      >
        <Command shouldFilter={true}>
          <CommandInput placeholder={resolvedSearchPlaceholder} className="h-9" />
          <CommandList className="max-h-[240px]">
            <CommandEmpty className="py-4 text-center text-sm text-gray-500">
              {resolvedEmptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={`${option.value} ${option.label} ${option.description || ""}`}
                    onSelect={() => toggleItem(option.value)}
                    className={cn(
                      "flex items-start gap-2.5 px-2 py-2 cursor-pointer",
                      isSelected && "bg-blue-50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-4 h-4 mt-0.5 rounded border shrink-0 transition-colors",
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 bg-white"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm text-gray-900 truncate">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="text-xs text-gray-500 truncate">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        {/* Footer */}
        {selected.length > 0 && (
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {selected.length} {t.filters.selected}
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              {t.filters.clearAll}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
