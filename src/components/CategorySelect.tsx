"use client";

import FilterSelect from "@/components/FilterSelect";
import { formatBnNumber } from "@/lib/format";
import type { CategoryProductGroup } from "@/lib/products";

interface CategorySelectProps {
  id: string;
  categories: CategoryProductGroup[];
  value: string;
  onChange: (next: string) => void;
  selectClassName?: string;
}

/** Compact category filter dropdown matching the sort select height and contrast. */
export default function CategorySelect({
  id,
  categories,
  value,
  onChange,
  selectClassName = "",
}: CategorySelectProps) {
  return (
    <FilterSelect
      id={id}
      ariaLabel="বিভাগ অনুযায়ী ফিল্টার"
      value={value}
      onChange={onChange}
      selectClassName={selectClassName}
    >
      <option value="all">সব বিভাগ</option>
      {categories.map((cat) => (
        <option key={cat.category} value={cat.category}>
          {cat.categoryNameBn} ({formatBnNumber(cat.items.length)})
        </option>
      ))}
    </FilterSelect>
  );
}
