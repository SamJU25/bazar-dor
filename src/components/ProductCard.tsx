"use client";

import Link from "next/link";
import PriceAmount from "@/components/PriceAmount";
import PriceChangeBadge from "@/components/PriceChangeBadge";
import { formatShortUnitBn } from "@/lib/format";
import type { IProduct } from "@/types/bazar";

interface ProductCardProps {
  product: IProduct;
  headingLevel?: "h2" | "h3" | "h4";
}

export default function ProductCard({
  product,
  headingLevel = "h3",
}: ProductCardProps) {
  const HeadingTag = headingLevel;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col justify-between h-full p-4 sm:p-5 rounded-2xl bg-white border border-[#dce6dc] hover:border-[#15803d] transition-colors"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-3 min-w-0">
          <div
            aria-hidden="true"
            className="w-11 h-11 rounded-xl bg-[#f3fbf4] border border-[#dcfce7] flex items-center justify-center text-2xl shrink-0"
          >
            {product.image}
          </div>
          <div className="min-w-0">
            <HeadingTag className="text-base font-semibold text-[#162218] group-hover:text-[#15803d] transition-colors leading-snug line-clamp-2">
              {product.nameBn}
            </HeadingTag>
            <p className="mt-0.5 text-xs text-slate-600 font-medium truncate">
              {product.categoryNameBn}
            </p>
          </div>
        </div>

        <PriceChangeBadge change={product.change} variant="inline" />
      </div>

      <div className="mt-4 pt-3 border-t border-[#e8efe8] flex items-baseline justify-between gap-2">
        <span className="text-base font-medium text-[#162218] tabular-nums">
          <PriceAmount
            value={product.today}
            unit={formatShortUnitBn(product.unit)}
            unitClassName="text-xs font-normal text-slate-600"
          />
        </span>

        <span className="text-xs text-slate-600 font-normal tabular-nums shrink-0">
          গতকাল <PriceAmount value={product.yesterday} />
        </span>
      </div>
    </Link>
  );
}
