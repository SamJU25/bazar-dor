import { MapPin } from "lucide-react";
import PriceAmount from "@/components/PriceAmount";
import { formatUnitBn } from "@/lib/format";
import type { IMarketPrice } from "@/types/bazar";

interface ProductMarketsSectionProps {
  markets: IMarketPrice[];
  unit: string;
  globalMin?: number;
  globalMax?: number;
}

function getMarketSpreadPct(
  marketMin: number,
  marketMax: number,
  globalMin: number,
  globalMax: number,
): { leftPct: number; widthPct: number } {
  const span = globalMax - globalMin;
  if (span <= 0) {
    return { leftPct: 0, widthPct: 100 };
  }
  const leftPct = Math.max(
    0,
    Math.min(100, ((marketMin - globalMin) / span) * 100),
  );
  const rightPct = Math.max(
    leftPct,
    Math.min(100, ((marketMax - globalMin) / span) * 100),
  );
  const widthPct = Math.max(8, rightPct - leftPct);
  return {
    leftPct: Math.min(leftPct, 100 - widthPct),
    widthPct,
  };
}

/** Market-by-market min, max, average, and spread indicator across desktop table and mobile cards. */
export default function ProductMarketsSection({
  markets,
  unit,
  globalMin,
  globalMax,
}: ProductMarketsSectionProps) {
  const computedMin =
    globalMin ??
    (markets.length > 0 ? Math.min(...markets.map((m) => m.min)) : 0);
  const computedMax =
    globalMax ??
    (markets.length > 0 ? Math.max(...markets.map((m) => m.max)) : 0);

  const marketRows = markets.map((market) => ({
    ...market,
    avg: (market.min + market.max) / 2,
    ...getMarketSpreadPct(market.min, market.max, computedMin, computedMax),
  }));

  return (
    <section aria-labelledby="market-prices-heading" className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2
          id="market-prices-heading"
          className="text-lg sm:text-xl font-bold text-[#162218]"
        >
          বাজারভিত্তিক দাম
        </h2>
        <span className="text-xs text-slate-600 font-medium">
          {formatUnitBn(unit)}
        </span>
      </div>

      {markets.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#dce6dc] px-5 py-8 text-center text-sm text-slate-600">
          এই পণ্যের জন্য কোনো বাজারের তথ্য পাওয়া যায়নি।
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl border border-[#dce6dc] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <caption className="sr-only">
                  বাজারভিত্তিক সর্বনিম্ন, সর্বাধিক ও গড় দামের তালিকা
                </caption>
                <thead>
                  <tr className="bg-[#f3fbf4] border-b border-[#dce6dc] text-xs font-semibold text-[#15803d]">
                    <th scope="col" className="py-3 px-5">বাজার</th>
                    <th scope="col" className="py-3 px-5">বিভাগ</th>
                    <th scope="col" className="py-3 px-5">পরিসর</th>
                    <th scope="col" className="py-3 px-5 text-right">সর্বনিম্ন</th>
                    <th scope="col" className="py-3 px-5 text-right">সর্বাধিক</th>
                    <th scope="col" className="py-3 px-5 text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8efe8] text-sm">
                  {marketRows.map((m, idx) => (
                    <tr
                      key={`${m.division}-${m.market}-${idx}`}
                      className="hover:bg-[#f8faf8] transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-[#162218]">
                        {m.market}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 text-xs font-medium">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} aria-hidden="true" />
                          {m.division}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 w-44">
                        <span className="sr-only">
                          <PriceAmount value={m.min} /> থেকে{" "}
                          <PriceAmount value={m.max} />
                        </span>
                        <div
                          aria-hidden="true"
                          className="relative h-1.5 rounded-full bg-[#eef3ee] overflow-hidden"
                        >
                          <div
                            className="absolute top-0 bottom-0 rounded-full bg-[#15803d]"
                            style={{
                              left: `${m.leftPct}%`,
                              width: `${m.widthPct}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right font-semibold text-[#15803d] tabular-nums">
                        <PriceAmount value={m.min} />
                      </td>
                      <td className="py-3.5 px-5 text-right font-semibold text-[#b91c1c] tabular-nums">
                        <PriceAmount value={m.max} />
                      </td>
                      <td className="py-3.5 px-5 text-right font-semibold text-[#162218] tabular-nums">
                        <PriceAmount value={m.avg} fractionDigits={1} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {marketRows.map((m, idx) => (
              <div
                key={`${m.division}-${m.market}-${idx}`}
                className="bg-white rounded-2xl border border-[#dce6dc] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-[#162218]">
                      {m.market}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} aria-hidden="true" />
                      <span>{m.division}</span>
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#15803d] tabular-nums">
                    গড় <PriceAmount value={m.avg} fractionDigits={1} />
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="relative h-1.5 rounded-full bg-[#eef3ee] overflow-hidden"
                >
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-[#15803d]"
                    style={{
                      left: `${m.leftPct}%`,
                      width: `${m.widthPct}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e8efe8] text-xs">
                  <div>
                    <span className="text-slate-600 block">সর্বনিম্ন</span>
                    <span className="font-semibold text-[#15803d] tabular-nums">
                      <PriceAmount value={m.min} />
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-600 block">সর্বাধিক</span>
                    <span className="font-semibold text-[#b91c1c] tabular-nums">
                      <PriceAmount value={m.max} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
