import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { formatBnNumber } from "@/lib/format";
import { getPriceChangeClasses } from "@/lib/products";
import type { IPriceChange } from "@/types/bazar";

interface PriceChangeBadgeProps {
  change: IPriceChange;
  tone?: "light" | "dark";
  variant?: "badge" | "inline";
  className?: string;
}

/** Displays a directional price-change indicator using crisp Lucide stroke icons. */
export default function PriceChangeBadge({
  change,
  tone = "light",
  variant = "badge",
  className = "",
}: PriceChangeBadgeProps) {
  const pct = formatBnNumber(Math.abs(change.pct), 1);
  const accessibleLabel =
    change.dir === "up"
      ? `গতকালের তুলনায় ${pct} শতাংশ বেড়েছে`
      : change.dir === "down"
        ? `গতকালের তুলনায় ${pct} শতাংশ কমেছে`
        : "গতকালের তুলনায় অপরিবর্তিত";

  const resolvedTone =
    variant === "inline"
      ? tone === "dark"
        ? "inline-dark"
        : "inline"
      : tone;

  const colorClasses = getPriceChangeClasses(change.dir, resolvedTone);

  const shapeClasses =
    variant === "inline"
      ? "inline-flex items-center justify-end gap-1 text-xs sm:text-sm font-semibold shrink-0 tabular-nums"
      : "inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold shrink-0 tabular-nums";

  const Icon =
    change.dir === "up" ? ArrowUp : change.dir === "down" ? ArrowDown : Minus;

  return (
    <span className={`${shapeClasses} ${colorClasses} ${className}`}>
      <Icon size={12} strokeWidth={2.25} aria-hidden="true" className="shrink-0" />
      <span aria-hidden="true">{pct}%</span>
      <span className="sr-only">{accessibleLabel}</span>
    </span>
  );
}
