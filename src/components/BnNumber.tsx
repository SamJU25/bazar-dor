import { formatBnNumber } from "@/lib/format";

interface BnNumberProps {
  value: number;
  fractionDigits?: number;
  className?: string;
}

/** Renders Bengali numerals with consistent tabular alignment. */
export default function BnNumber({
  value,
  fractionDigits = 0,
  className = "",
}: BnNumberProps) {
  return (
    <span className={`tabular-nums ${className}`}>
      {formatBnNumber(value, fractionDigits)}
    </span>
  );
}
