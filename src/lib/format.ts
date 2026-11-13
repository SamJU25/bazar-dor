const UNIT_MAP: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const SHORT_UNIT_MAP: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

const DHAKA_DATE_FORMATTER = new Intl.DateTimeFormat("bn-BD", {
  timeZone: "Asia/Dhaka",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatBnNumber(value: number, fractionDigits = 0): string {
  return value.toLocaleString("bn-BD", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatPriceBn(value: number, fractionDigits = 0): string {
  return `৳ ${formatBnNumber(value, fractionDigits)}`;
}

export function formatUnitBn(unit: string): string {
  return UNIT_MAP[unit] ?? unit;
}

export function formatShortUnitBn(unit: string): string {
  return SHORT_UNIT_MAP[unit] ?? unit;
}

export function formatDhakaDateBn(date: Date = new Date()): string {
  return DHAKA_DATE_FORMATTER.format(date);
}
