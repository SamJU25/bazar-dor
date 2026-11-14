"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import Marquee from "react-fast-marquee";
import PriceAmount from "@/components/PriceAmount";
import PriceChangeBadge from "@/components/PriceChangeBadge";
import { formatShortUnitBn } from "@/lib/format";
import type { IProduct } from "@/types/bazar";

interface PriceTickerProps {
  products: IProduct[];
}

export default function PriceTicker({ products }: PriceTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const trackWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const root = trackWrapperRef.current;
    if (!root) return;

    const markClonedTracks = () => {
      const tracks = root.querySelectorAll<HTMLElement>(".rfm-marquee");
      tracks.forEach((track, index) => {
        if (index > 0) {
          track.setAttribute("aria-hidden", "true");
          track.setAttribute("inert", "");
        }
      });
    };

    markClonedTracks();
    const observer = new MutationObserver(markClonedTracks);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [products.length]);

  if (!products.length) return null;

  const movers = products
    .filter((p) => p.change.dir !== "flat")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct));
  const tickerItems = (movers.length >= 10 ? movers : products).slice(0, 14);
  const isPlaying = !isPaused && !isFocusPaused && !prefersReducedMotion;

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
          ref={trackWrapperRef}
          onFocus={() => setIsFocusPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsFocusPaused(false);
            }
          }}
          className="flex-1 min-w-0 h-full overflow-hidden"
        >
          <Marquee
            play={isPlaying}
            pauseOnHover
            speed={42}
            gradient
            gradientColor="#162218"
            gradientWidth={24}
            className="flex items-center h-full"
          >
            {tickerItems.map((item) => (
              <div key={item.id} className="flex items-center">
                <Link
                  href={`/product/${item.slug}`}
                  className="flex items-center gap-2 mx-1 px-2.5 py-1 rounded-md hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors whitespace-nowrap text-xs sm:text-sm"
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    {item.image}
                  </span>
                  <span className="font-medium text-white/90">{item.nameBn}</span>
                  <span className="font-semibold text-white tabular-nums">
                    <PriceAmount
                      value={item.today}
                      unit={formatShortUnitBn(item.unit)}
                      unitClassName="text-[11px] font-normal text-white/60"
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
          </Marquee>
        </div>

        <div className="pl-2 ml-2 h-full flex items-center border-l border-white/15 shrink-0">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-pressed={!isPlaying}
            aria-label={isPlaying ? "লাইভ দর থামান" : "লাইভ দর চালু করুন"}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95 motion-reduce:active:transform-none transition-colors cursor-pointer ${
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
