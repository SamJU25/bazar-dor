"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import PriceAmount from "@/components/PriceAmount";
import PriceChangeBadge from "@/components/PriceChangeBadge";
import { formatShortUnitBn } from "@/lib/format";
import type { ITickerItem } from "@/types/bazar";

interface PriceTickerProps {
  items: ITickerItem[];
}

function TickerItemRow({ items }: { items: ITickerItem[] }) {
  return (
    <div className="flex items-center shrink-0">
      {items.map((item) => (
        <div key={item.id} className="flex items-center">
          <Link
            href={`/product/${item.slug}`}
            prefetch={false}
            className="flex items-center gap-2 mx-1 px-2.5 py-1 rounded-md hover:bg-white/10 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors whitespace-nowrap text-xs sm:text-sm"
          >
            <span aria-hidden="true" className="text-base leading-none">
              {item.image}
            </span>
            <span className="font-medium text-white/95">{item.nameBn}</span>
            <span className="font-semibold text-white tabular-nums">
              <PriceAmount
                value={item.today}
                unit={formatShortUnitBn(item.unit)}
                unitClassName="text-[11px] font-normal text-white/70"
              />
            </span>
            <PriceChangeBadge
              change={item.change}
              tone="dark"
              variant="inline"
            />
          </Link>
          <span aria-hidden="true" className="h-4 w-px bg-white/10 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function PriceTicker({ items }: PriceTickerProps) {
  const [manualPlay, setManualPlay] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  if (!items.length) return null;

  const isPlaying =
    manualPlay === null ? !prefersReducedMotion : manualPlay;

  const handleToggle = () => {
    setManualPlay((prev) => {
      const current = prev === null ? !prefersReducedMotion : prev;
      return !current;
    });
  };

  return (
    <section
      aria-label="আজকের লাইভ দর"
      className="w-full bg-[#162218] text-white border-b border-emerald-950/60"
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 flex items-center h-10 overflow-hidden">
        <div className="hidden sm:flex items-center pr-3.5 mr-1 h-full border-r border-white/15 text-emerald-300 text-xs font-semibold shrink-0">
          <span>আজকের দর</span>
        </div>

        <div
          className={`bazardor-ticker-viewport relative flex-1 min-w-0 h-full flex items-center ${
            isPlaying ? "overflow-hidden" : "overflow-x-auto no-scrollbar"
          }`}
        >
          {isPlaying ? (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#162218] to-transparent z-10"
              />
              <div className="bazardor-ticker-track">
                <TickerItemRow items={items} />
                <div aria-hidden="true" inert className="flex items-center shrink-0">
                  <TickerItemRow items={items} />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#162218] to-transparent z-10"
              />
            </>
          ) : (
            <TickerItemRow items={items} />
          )}
        </div>

        <div className="pl-2 ml-2 h-full flex items-center border-l border-white/15 shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            aria-pressed={!isPlaying}
            aria-label={isPlaying ? "লাইভ দর থামান" : "লাইভ দর চালু করুন"}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95 motion-reduce:active:transform-none transition-colors cursor-pointer ${
              !isPlaying
                ? "bg-white/15 border-white/15 text-emerald-300"
                : "border-transparent text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {isPlaying ? (
              <Pause size={14} aria-hidden="true" />
            ) : (
              <Play size={14} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
