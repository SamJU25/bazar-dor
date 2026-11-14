"use client";

import { useMemo } from "react";
import FilterSelect, {
  type FilterSelectOption,
} from "@/components/FilterSelect";
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
  const options = useMemo<FilterSelectOption[]>(
    () => [
      { value: "all", label: "সব বিভাগ" },
      ...categories.map((cat) => ({
        value: cat.category,
        label: `${cat.categoryNameBn} (${formatBnNumber(cat.items.length)})`,
      })),
    ],
    [categories],
  );

  return (
    <FilterSelect
      id={id}
      ariaLabel="বিভাগ অনুযায়ী ফিল্টার"
      value={value}
      onChange={onChange}
      options={options}
      selectClassName={selectClassName}
    />
  );
}
