'use client'

import { Select } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'

export function SelectField({
  label,
  value,
  onValueChange,
  items,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  items: readonly string[]
}) {
  return (
    <Select.Root value={value} onValueChange={(next) => onValueChange((next as string) ?? '')}>
      <Select.Label className="field-label">{label}</Select.Label>
      <Select.Trigger className="select-trigger">
        <Select.Value className="select-value" />
        <Select.Icon className="select-icon">
          <ChevronDown size={15} strokeWidth={1.5} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner className="select-positioner" sideOffset={8} alignItemWithTrigger={false}>
          <Select.Popup className="select-popup">
            {items.map((item) => (
              <Select.Item key={item} value={item} className="select-item">
                <Select.ItemText>{item}</Select.ItemText>
                <Select.ItemIndicator className="select-indicator">
                  <Check size={13} strokeWidth={2} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
