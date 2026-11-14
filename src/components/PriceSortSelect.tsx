"use client";

import FilterSelect, {
  type FilterSelectOption,
} from "@/components/FilterSelect";
import type { SortOption } from "@/lib/products";

const SORT_OPTIONS: readonly FilterSelectOption[] = [
  { value: "default", label: "ডিফল্ট সাজান" },
  { value: "price-asc", label: "দাম: কম থেকে বেশি" },
  { value: "price-desc", label: "দাম: বেশি থেকে কম" },
];

interface PriceSortSelectProps {
  id: string;
  value: SortOption;
  onChange: (next: SortOption) => void;
  selectClassName?: string;
}

/** Compact accessible sort dropdown without redundant label noise. */
export default function PriceSortSelect({
  id,
  value,
  onChange,
  selectClassName = "",
}: PriceSortSelectProps) {
  return (
    <FilterSelect
      id={id}
      ariaLabel="দাম অনুযায়ী সাজান"
      value={value}
      onChange={(next) => onChange(next as SortOption)}
      options={SORT_OPTIONS}
      selectClassName={selectClassName}
    />
  );
}
