import { formatPriceBn } from "@/lib/format";

interface PriceAmountProps {
  value: number;
  fractionDigits?: number;
  unit?: string;
  unitClassName?: string;
}

/** Renders a Taka amount with consistent tabular numerals and optional unit suffix. */
export default function PriceAmount({
  value,
  fractionDigits = 0,
  unit,
  unitClassName = "text-[0.72em] font-medium opacity-75",
}: PriceAmountProps) {
  return (
    <span className="tabular-nums">
      {formatPriceBn(value, fractionDigits)}
      {unit ? <span className={unitClassName}>/{unit}</span> : null}
    </span>
  );
}
