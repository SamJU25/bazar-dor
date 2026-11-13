"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import BnNumber from "@/components/BnNumber";
import { type DirectionFilter, getDirectionCounts } from "@/lib/products";
import type { IProduct } from "@/types/bazar";

interface DirectionFilterBarProps {
  products: IProduct[];
  value: DirectionFilter;
  onChange: (next: DirectionFilter) => void;
}

const FILTER_OPTIONS: {
  id: DirectionFilter;
  label: string;
  activeClass: string;
}[] = [
  {
    id: "all",
    label: "সবগুলো",
    activeClass: "bg-[#15803d] text-white border-[#15803d] font-semibold",
  },
  {
    id: "up",
    label: "দাম বেড়েছে",
    activeClass: "bg-[#15803d] text-white border-[#15803d] font-semibold",
  },
  {
    id: "down",
    label: "দাম কমেছে",
    activeClass: "bg-[#b91c1c] text-white border-[#b91c1c] font-semibold",
  },
  {
    id: "flat",
    label: "অপরিবর্তিত",
    activeClass: "bg-[#334155] text-white border-[#334155] font-semibold",
  },
];

/** Segmented price-direction filter bar showing live counts per movement type. */
export default function DirectionFilterBar({
  products,
  value,
  onChange,
}: DirectionFilterBarProps) {
  const counts = getDirectionCounts(products);

  return (
    <div
      role="group"
      aria-label="দামের পরিবর্তন অনুযায়ী ফিল্টার"
      className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#eef3ee] border border-[#dce6dc] max-w-full overflow-x-auto no-scrollbar"
    >
      {FILTER_OPTIONS.map((option) => {
        const count = counts[option.id];
        const isActive = value === option.id;
        const isDisabled = option.id !== "all" && count === 0;

        return (
          <button
            key={option.id}
            type="button"
            disabled={isDisabled}
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={`inline-flex items-center gap-1.5 h-10 sm:h-9 px-3.5 sm:px-3 rounded-lg border text-xs sm:text-sm leading-none whitespace-nowrap transition-colors shrink-0 ${
              isActive
                ? option.activeClass
                : "border-transparent text-[#334155] hover:bg-white/80 hover:text-[#162218] font-medium"
            } ${
              isDisabled
                ? "opacity-45 cursor-not-allowed hover:bg-transparent"
                : "cursor-pointer"
            }`}
          >
            {option.id === "up" ? (
              <TrendingUp
                size={14}
                className={isActive ? "text-white" : "text-[#15803d]"}
                aria-hidden="true"
              />
            ) : null}
            {option.id === "down" ? (
              <TrendingDown
                size={14}
                className={isActive ? "text-white" : "text-[#b91c1c]"}
                aria-hidden="true"
              />
            ) : null}
            {option.id === "flat" ? (
              <Minus
                size={14}
                className={isActive ? "text-white" : "text-slate-600"}
                aria-hidden="true"
              />
            ) : null}
            <span>{option.label}</span>
            <BnNumber
              value={count}
              className={`text-[11px] sm:text-xs font-semibold ${
                isActive ? "text-white/90" : "text-slate-600"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
