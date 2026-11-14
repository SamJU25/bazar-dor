"use client";

import { ListBox, Select } from "@heroui/react";
import { ChevronDown } from "lucide-react";

export interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  id: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterSelectOption[];
  selectClassName?: string;
}

/** Shared HeroUI select with sage border, focus ring, and themed option popover. */
export default function FilterSelect({
  id,
  ariaLabel,
  value,
  onChange,
  options,
  selectClassName = "",
}: FilterSelectProps) {
  return (
    <Select
      aria-label={ariaLabel}
      value={value}
      onChange={(next) => {
        if (next != null) {
          onChange(String(next));
        }
      }}
      className={selectClassName}
    >
      <Select.Trigger
        id={id}
        className="w-full min-w-[9.25rem] h-11 sm:h-10 pl-3.5 pr-9 rounded-xl bg-white border border-[#7f9484] text-base sm:text-sm font-medium text-[#162218] shadow-none focus:outline-none focus-visible:outline-none data-[hovered=true]:bg-white data-[hovered=true]:border-[#15803d] data-[open=true]:border-[#15803d] data-[open=true]:ring-2 data-[open=true]:ring-[#15803d]/25 data-[focus-visible=true]:outline-none data-[focus-visible=true]:border-[#15803d] data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-[#15803d] transition-colors cursor-pointer"
      >
        <Select.Value className="text-base sm:text-sm font-medium text-[#162218] truncate" />
        <Select.Indicator className="end-3 text-slate-500">
          <ChevronDown size={15} aria-hidden="true" />
        </Select.Indicator>
      </Select.Trigger>

      <Select.Popover placement="bottom start" offset={6}>
        <ListBox aria-label={ariaLabel} className="space-y-0.5">
          {options.map((opt) => (
            <ListBox.Item
              key={opt.value}
              id={opt.value}
              textValue={opt.label}
              className="text-sm leading-snug whitespace-nowrap"
            >
              <span>{opt.label}</span>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
