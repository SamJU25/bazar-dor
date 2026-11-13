"use client";

import FilterSelect from "@/components/FilterSelect";
import type { SortOption } from "@/lib/products";

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
      selectClassName={selectClassName}
    >
      <option value="default">ডিফল্ট সাজান</option>
      <option value="price-asc">দাম: কম থেকে বেশি</option>
      <option value="price-desc">দাম: বেশি থেকে কম</option>
    </FilterSelect>
  );
}
