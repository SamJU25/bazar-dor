"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
  id: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  selectClassName?: string;
  children: ReactNode;
}

/** Shared native select wrapper with consistent sage border, focus ring, and chevron indicator. */
export default function FilterSelect({
  id,
  ariaLabel,
  value,
  onChange,
  selectClassName = "",
  children,
}: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none text-base sm:text-sm font-medium text-[#162218] bg-white border border-[#7f9484] hover:border-[#15803d] rounded-xl h-11 sm:h-10 pl-3.5 pr-9 focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 cursor-pointer transition-colors ${selectClassName}`}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      />
    </div>
  );
}
