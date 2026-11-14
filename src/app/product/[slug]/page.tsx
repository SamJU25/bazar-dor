import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import BnNumber from "@/components/BnNumber";
import PriceAmount from "@/components/PriceAmount";
import PriceChangeBadge from "@/components/PriceChangeBadge";
import ProductMarketsSection from "@/components/ProductMarketsSection";
import { getCachedServerSession } from "@/lib/auth";
import { buildAuthUrl } from "@/lib/auth-helpers";
import { getCachedProductDetailsStrict } from "@/lib/catalog";
import {
  formatShortUnitBn,
  formatUnitBn,
} from "@/lib/format";
import { computeMarketSummary } from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const session = await getCachedServerSession();
  if (!session) {
    return {
      title: "সাইন ইন",
      robots: { index: false, follow: false },
    };
  }
  const { slug } = await params;
  try {
    const product = await getCachedProductDetailsStrict(slug);
    return {
      title: product ? product.nameBn : { absolute: "বাজার দর" },
      robots: { index: false, follow: false },
    };
  } catch {
    return {
      title: { absolute: "বাজার দর" },
      robots: { index: false, follow: false },
    };
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getCachedServerSession();
  if (!session) {
    redirect(buildAuthUrl("/signin", `/product/${slug}`, "auth_required"));
  }

  const product = await getCachedProductDetailsStrict(slug);

  if (!product) {
    notFound();
  }

  const markets = product.markets ?? [];
  const { minPrice, maxPrice, avgPrice, cheapestMarket, costliestMarket } =
    computeMarketSummary(product);

  const priceSteps = [
    { label: "গত মাস", value: product.lastMonth, current: false },
    { label: "গত সপ্তাহ", value: product.lastWeek, current: false },
    { label: "গতকাল", value: product.yesterday, current: false },
    { label: "আজ", value: product.today, current: true },
  ];

  return (
    <div className="w-full py-6 sm:py-8 bg-[#f8faf8]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-6">
        <nav
          aria-label="ব্রেডক্রাম্ব"
          className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#15803d] transition-colors"
          >
            <Home size={14} aria-hidden="true" />
            <span>হোম</span>
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link
            href={`/category/${product.category}`}
            className="flex items-center gap-1 hover:text-[#15803d] transition-colors"
          >
            <span aria-hidden="true">{product.categoryIcon}</span>
            <span>{product.categoryNameBn}</span>
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="font-semibold text-[#162218]">
            {product.nameBn}
          </span>
        </nav>

        {/* Product Header */}
        <section className="bg-white rounded-2xl border border-[#dce6dc] p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#f3fbf4] border border-[#dcfce7] flex items-center justify-center text-3xl sm:text-4xl shrink-0"
            >
              {product.image}
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#162218]">
                {product.nameBn}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 tabular-nums">
                {product.categoryNameBn} · {formatUnitBn(product.unit)} ·{" "}
                <BnNumber value={markets.length} /> বাজার
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:items-end gap-1.5 shrink-0">
            <span className="text-2xl sm:text-3xl font-semibold text-[#162218] tabular-nums">
              <PriceAmount
                value={product.today}
                unit={formatShortUnitBn(product.unit)}
                unitClassName="text-sm font-normal text-slate-600"
              />
            </span>
            <div className="flex items-center gap-2">
              <PriceChangeBadge change={product.change} />
              <span className="text-xs text-slate-600 tabular-nums">
                গতকাল <PriceAmount value={product.yesterday} />
              </span>
            </div>
          </div>
        </section>

        {/* Key Price Spread */}
        <section
          aria-label="দামের সারসংক্ষেপ"
          className="bg-white rounded-2xl border border-[#dce6dc] grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e8efe8]"
        >
          <div className="p-4 sm:p-5 space-y-1">
            <span className="text-xs font-medium text-slate-600 block">
              সর্বনিম্ন
            </span>
            <p className="text-xl sm:text-2xl font-semibold text-[#15803d] tabular-nums">
              <PriceAmount value={minPrice} />
            </p>
            {cheapestMarket ? (
              <p className="text-xs text-slate-600">
                {cheapestMarket.market}, {cheapestMarket.division}
              </p>
            ) : null}
          </div>

          <div className="p-4 sm:p-5 space-y-1">
            <span className="text-xs font-medium text-slate-600 block">
              সর্বাধিক
            </span>
            <p className="text-xl sm:text-2xl font-semibold text-[#b91c1c] tabular-nums">
              <PriceAmount value={maxPrice} />
            </p>
            {costliestMarket ? (
              <p className="text-xs text-slate-600">
                {costliestMarket.market}, {costliestMarket.division}
              </p>
            ) : null}
          </div>

          <div className="p-4 sm:p-5 space-y-1">
            <span className="text-xs font-medium text-slate-600 block">
              গড়
            </span>
            <p className="text-xl sm:text-2xl font-semibold text-[#162218] tabular-nums">
              <PriceAmount value={avgPrice} fractionDigits={1} />
            </p>
          </div>
        </section>

        {/* Historical Timeline */}
        <section
          aria-label="পূর্ববর্তী দাম"
          className="bg-white rounded-2xl border border-[#dce6dc] grid grid-cols-2 sm:grid-cols-4 overflow-hidden"
        >
          {priceSteps.map((step) => (
            <div
              key={step.label}
              className={`p-4 sm:px-5 border-b sm:border-b-0 odd:border-r sm:border-r sm:last:border-r-0 [&:nth-child(n+3)]:border-b-0 border-[#e8efe8] ${
                step.current ? "bg-[#f3fbf4]" : ""
              }`}
            >
              <span
                className={`text-xs font-medium block ${
                  step.current ? "text-[#166534]" : "text-slate-600"
                }`}
              >
                {step.label}
              </span>
              <span
                className={`text-base sm:text-lg font-semibold tabular-nums mt-0.5 block ${
                  step.current ? "text-[#15803d]" : "text-[#162218]"
                }`}
              >
                <PriceAmount value={step.value} />
              </span>
            </div>
          ))}
        </section>

        <ProductMarketsSection
          markets={markets}
          unit={product.unit}
          globalMin={minPrice}
          globalMax={maxPrice}
        />
      </div>
    </div>
  );
}
