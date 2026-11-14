"use client";

import { useMemo, useReducer } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import CatalogEmptyPanel from "@/components/CatalogEmptyPanel";
import DirectionFilterBar from "@/components/DirectionFilterBar";
import PriceSortSelect from "@/components/PriceSortSelect";
import ProductCard from "@/components/ProductCard";
import {
  INITIAL_CATALOG_FILTER_STATE,
  catalogFilterReducer,
  deriveCatalogView,
} from "@/lib/state-machines";
import type { IProductSummary } from "@/types/bazar";

export default function CategoryProducts({
  products,
}: {
  products: IProductSummary[];
}) {
  const [filterState, dispatch] = useReducer(
    catalogFilterReducer,
    INITIAL_CATALOG_FILTER_STATE,
  );

  const catalogView = useMemo(
    () => deriveCatalogView(products, filterState),
    [products, filterState],
  );

  if (catalogView.status === "upstream-empty") {
    return (
      <div
        data-state={catalogView.status}
        className="bg-white rounded-2xl border border-[#dce6dc] p-10 sm:p-14 text-center space-y-4"
      >
        <h2 className="text-lg sm:text-xl font-bold text-[#162218]">
          এই বিভাগে কোনো পণ্য নেই
        </h2>
        <div>
          <Link
            href="/"
            className="btn-primary h-11 sm:h-10 px-5 rounded-xl"
          >
            <Home size={16} aria-hidden="true" />
            <span>হোম পেজ</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-state={catalogView.status} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <DirectionFilterBar
          products={products}
          value={filterState.direction}
          onChange={(direction) =>
            dispatch({ type: "SET_DIRECTION", direction })
          }
        />

        <div className="w-full sm:w-auto">
          <PriceSortSelect
            id="category-sort"
            value={filterState.sortBy}
            onChange={(sortBy) => dispatch({ type: "SET_SORT", sortBy })}
            selectClassName="w-full sm:w-auto"
          />
        </div>
      </div>

      {catalogView.status !== "populated" ? (
        <CatalogEmptyPanel
          message="এই ফিল্টারে কোনো পণ্য নেই।"
          actionLabel="সব পণ্য দেখুন"
          onAction={() => dispatch({ type: "RESET_FILTERS" })}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {catalogView.visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              headingLevel="h2"
            />
          ))}
        </div>
      )}
    </div>
  );
}
