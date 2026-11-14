"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { formatDhakaDateBn } from "@/lib/format";

interface NavbarDateProps {
  initialDate: string;
}

export default function NavbarDate({ initialDate }: NavbarDateProps) {
  const [dateLabel, setDateLabel] = useState(initialDate);

  useEffect(() => {
    const syncDate = () => setDateLabel(formatDhakaDateBn());
    syncDate();

    const intervalId = window.setInterval(syncDate, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center gap-1.5 min-w-0 text-xs text-slate-600 font-medium leading-none">
      <Calendar
        size={12}
        aria-hidden="true"
        className="text-slate-500 shrink-0"
      />
      <span className="truncate">{dateLabel}</span>
    </div>
  );
}
