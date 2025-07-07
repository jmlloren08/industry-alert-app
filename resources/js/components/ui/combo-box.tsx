"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboBoxOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface ComboBoxListProps {
  data: ComboBoxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  error?: boolean
  width?: string
  displayField?: 'label' | 'both'
}

export function ComboBoxList({
  data = [],
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  className,
  disabled = false,
  error = false,
  width = "w-full",
  displayField = 'label',
}: ComboBoxListProps) {

  const [open, setOpen] = React.useState(false);
  const selectedItem = data.find((item) => item.value === value);

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? "" : selectedValue;
    onValueChange?.(newValue);
    setOpen(false);
  }

  const getDisplayText = () => {
    if (!selectedItem) return placeholder;

    if (displayField === 'both' && selectedItem.description) {
      return `${selectedItem.label} - ${selectedItem.description}`;
    }

    return selectedItem.label;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            width,
            "justify-between",
            error && "border-red-500",
            disabled && "cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          {getDisplayText()}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        align="start"
        // side="bottom"
        // sideOffset={4}
        // onInteractOutside={(e) => {
        //   if (e.target instanceof Element &&
        //     e.target.closest('[data-radix-popper-content-wrapper]')) {
        //     e.preventDefault();
        //   }
        // }}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={`${item.label} ${item.description || ""}`}
                  onSelect={() => handleSelect(String(item.value))}
                  disabled={item.disabled}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col flex-1">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500">{item.description}</div>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
