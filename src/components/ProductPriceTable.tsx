import Link from "next/link";
import PriceAmount from "@/components/PriceAmount";
import PriceChangeBadge from "@/components/PriceChangeBadge";
import { formatUnitBn } from "@/lib/format";
import type { IProductSummary } from "@/types/bazar";

interface ProductPriceTableProps {
  items: IProductSummary[];
  headingLevel?: "h3" | "h4";
  showCategoryInSubtitle?: boolean;
}

const GRID_COLS =
  "sm:grid sm:grid-cols-[minmax(0,1fr)_4.75rem_5.25rem_4.5rem] xl:grid-cols-[minmax(0,1fr)_5.5rem_5.75rem_5rem] sm:items-center sm:gap-3";

/** Structured responsive price table shared by mover panels and category catalog panels. */
export default function ProductPriceTable({
  items,
  headingLevel = "h3",
  showCategoryInSubtitle = true,
}: ProductPriceTableProps) {
  const HeadingTag = headingLevel;

  return (
    <div>
      <div
        aria-hidden="true"
        className={`hidden ${GRID_COLS} px-4 sm:px-5 py-2 border-b border-[#eef3ee] bg-[#fafcfa] text-xs font-medium text-slate-600`}
      >
        <span>পণ্য</span>
        <span className="text-right">গতকাল</span>
        <span className="text-right">আজ</span>
        <span className="text-right">পরিবর্তন</span>
      </div>

      <div className="divide-y divide-[#eef3ee]">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.slug}`}
            prefetch={false}
            className={`flex items-center justify-between gap-3 ${GRID_COLS} px-4 sm:px-5 py-3 hover:bg-[#f8faf8] transition-colors group`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                aria-hidden="true"
                className="w-9 h-9 rounded-xl bg-[#f3fbf4] border border-[#dcfce7] flex items-center justify-center text-lg shrink-0"
              >
                {item.image}
              </span>
              <div className="min-w-0">
                <HeadingTag className="text-sm sm:text-base font-semibold text-[#162218] group-hover:text-[#15803d] leading-snug line-clamp-2 transition-colors">
                  {item.nameBn}
                </HeadingTag>
                <p className="text-xs text-slate-600 tabular-nums sm:hidden truncate">
                  {formatUnitBn(item.unit)} · গতকাল{" "}
                  <PriceAmount value={item.yesterday} />
                </p>
                <p className="hidden sm:block text-xs text-slate-600 truncate">
                  {showCategoryInSubtitle
                    ? `${item.categoryNameBn} · ${formatUnitBn(item.unit)}`
                    : formatUnitBn(item.unit)}
                </p>
              </div>
            </div>

            <span className="hidden sm:block text-right text-sm text-slate-600 font-normal tabular-nums">
              <span className="sr-only">গতকাল </span>
              <PriceAmount value={item.yesterday} />
            </span>

            <div className="flex items-center gap-2.5 shrink-0 sm:contents">
              <span className="text-sm sm:text-base sm:text-right font-medium text-[#162218] tabular-nums whitespace-nowrap">
                <span className="sr-only">আজ </span>
                <PriceAmount value={item.today} />
              </span>
              <div className="sm:flex sm:justify-end">
                <PriceChangeBadge change={item.change} variant="inline" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
