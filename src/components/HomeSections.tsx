"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, TrendingDown, TrendingUp, X } from "lucide-react";
import BnNumber from "@/components/BnNumber";
import CatalogEmptyPanel from "@/components/CatalogEmptyPanel";
import CategorySelect from "@/components/CategorySelect";
import DirectionFilterBar from "@/components/DirectionFilterBar";
import PriceSortSelect from "@/components/PriceSortSelect";
import ProductCard from "@/components/ProductCard";
import ProductPriceTable from "@/components/ProductPriceTable";
import {
  type DirectionFilter,
  type SortOption,
  getDirectionCounts,
  getTopMovers,
  groupProductsByCategory,
} from "@/lib/products";
import {
  INITIAL_CATALOG_FILTER_STATE,
  catalogFilterReducer,
  deriveCatalogView,
} from "@/lib/state-machines";
import type { IProduct } from "@/types/bazar";

const VALID_DIRECTIONS = new Set<DirectionFilter>(["all", "up", "down", "flat"]);
const VALID_SORTS = new Set<SortOption>(["default", "price-asc", "price-desc"]);

function MoverPanel({
  id,
  title,
  items,
  totalCount,
  onViewAll,
  tone,
}: {
  id: string;
  title: string;
  items: IProduct[];
  totalCount: number;
  onViewAll: () => void;
  tone: "up" | "down";
}) {
  return (
    <section
      aria-labelledby={id}
      data-state={items.length === 0 ? "empty" : "populated"}
      className="bg-white rounded-2xl border border-[#dce6dc] overflow-hidden"
    >
      <div className="px-4 sm:px-5 py-3.5 border-b border-[#e8efe8] bg-white flex items-center justify-between gap-3">
        <h2
          id={id}
          className="text-base sm:text-lg font-bold text-[#162218] flex items-center gap-2 min-w-0"
        >
          {tone === "up" ? (
            <TrendingUp
              size={18}
              strokeWidth={2.25}
              className="text-[#15803d] shrink-0"
              aria-hidden="true"
            />
          ) : (
            <TrendingDown
              size={18}
              strokeWidth={2.25}
              className="text-[#b91c1c] shrink-0"
              aria-hidden="true"
            />
          )}
          <span>{title}</span>
        </h2>

        {totalCount > items.length ? (
          <button
            type="button"
            onClick={onViewAll}
            className={`inline-flex items-center gap-1 px-2 py-1 -my-1 -mr-2 rounded-lg text-xs sm:text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d]/40 transition-colors shrink-0 cursor-pointer ${
              tone === "up"
                ? "text-[#15803d] hover:text-[#166534] hover:bg-[#f3fbf4]"
                : "text-[#b91c1c] hover:text-[#991b1b] hover:bg-[#fff1f2]"
            }`}
          >
            <span>
              সবগুলো (<BnNumber value={totalCount} />)
            </span>
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="px-4 sm:px-5 py-6 text-xs sm:text-sm text-slate-600 text-center">
          {tone === "up"
            ? "আজ কোনো পণ্যের দাম বাড়েনি।"
            : "আজ কোনো পণ্যের দাম কমেনি।"}
        </p>
      ) : (
        <ProductPriceTable items={items} headingLevel="h3" />
      )}
    </section>
  );
}

export default function HomeSections({ products }: { products: IProduct[] }) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const didHydrateUrlRef = useRef(false);
  const [filterState, dispatch] = useReducer(
    catalogFilterReducer,
    INITIAL_CATALOG_FILTER_STATE,
  );

  const categoryGroups = useMemo(
    () => groupProductsByCategory(products),
    [products],
  );

  useEffect(() => {
    const validCategories = new Set(categoryGroups.map((g) => g.category));
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const cat = params.get("cat");
    const dir = params.get("dir") as DirectionFilter | null;
    const sort = params.get("sort") as SortOption | null;

    if (q) dispatch({ type: "SET_QUERY", query: q });
    if (cat && validCategories.has(cat)) {
      dispatch({ type: "SET_CATEGORY", category: cat });
    }
    if (dir && VALID_DIRECTIONS.has(dir)) {
      dispatch({ type: "SET_DIRECTION", direction: dir });
    }
    if (sort && VALID_SORTS.has(sort)) {
      dispatch({ type: "SET_SORT", sortBy: sort });
    }
    didHydrateUrlRef.current = true;
  }, [categoryGroups]);

  useEffect(() => {
    if (!didHydrateUrlRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (filterState.query.trim()) {
      params.set("q", filterState.query);
    } else {
      params.delete("q");
    }
    if (filterState.category !== "all") {
      params.set("cat", filterState.category);
    } else {
      params.delete("cat");
    }
    if (filterState.direction !== "all") {
      params.set("dir", filterState.direction);
    } else {
      params.delete("dir");
    }
    if (filterState.sortBy !== "default") {
      params.set("sort", filterState.sortBy);
    } else {
      params.delete("sort");
    }

    const qs = params.toString();
    const nextUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [
    filterState.query,
    filterState.category,
    filterState.direction,
    filterState.sortBy,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      event.preventDefault();
      searchInputRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const risers = useMemo(() => getTopMovers(products, "up", 5), [products]);
  const fallers = useMemo(() => getTopMovers(products, "down", 5), [products]);
  const directionCounts = useMemo(
    () => getDirectionCounts(products),
    [products],
  );

  const handleViewAllMovers = (direction: "up" | "down") => {
    dispatch({ type: "RESET_FILTERS" });
    dispatch({ type: "SET_DIRECTION", direction });
    document.getElementById("সব-পণ্য")?.scrollIntoView({ behavior: "smooth" });
  };

  const catalogView = useMemo(
    () => deriveCatalogView(products, filterState),
    [products, filterState],
  );

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 lg:py-10 space-y-8 sm:space-y-10 lg:space-y-12">
      {/* Section A & B: Market Movers */}
      <div
        id="দর-পরিবর্তন"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-32 lg:scroll-mt-24"
      >
        <MoverPanel
          id="section-risers"
          title="আজ দাম বেড়েছে"
          items={risers}
          totalCount={directionCounts.up}
          onViewAll={() => handleViewAllMovers("up")}
          tone="up"
        />

        <MoverPanel
          id="section-fallers"
          title="আজ দাম কমেছে"
          items={fallers}
          totalCount={directionCounts.down}
          onViewAll={() => handleViewAllMovers("down")}
          tone="down"
        />
      </div>

      {/* Section C: All Products */}
      <section
        id="সব-পণ্য"
        aria-labelledby="section-all-products"
        data-state={catalogView.status}
        className="space-y-6 scroll-mt-32 lg:scroll-mt-24"
      >
        <div className="space-y-4">
          <div className="flex items-baseline gap-2.5">
            <h2
              id="section-all-products"
              className="text-xl sm:text-2xl font-bold text-[#162218]"
            >
              সব পণ্য
            </h2>
            {catalogView.hasActiveFilters ? (
              <span className="text-xs sm:text-sm font-medium text-slate-600 tabular-nums">
                <BnNumber value={catalogView.visibleProducts.length} />টি পণ্য
              </span>
            ) : null}
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <DirectionFilterBar
              products={catalogView.searchMatchedProducts}
              value={filterState.direction}
              onChange={(direction) =>
                dispatch({ type: "SET_DIRECTION", direction })
              }
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <div className="relative">
                <Search
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={filterState.query}
                  onChange={(e) =>
                    dispatch({ type: "SET_QUERY", query: e.target.value })
                  }
                  placeholder="খুঁজুন (/)"
                  aria-label="পণ্যের নাম খুঁজুন"
                  className="w-full sm:w-52 h-11 sm:h-10 pl-9 pr-10 rounded-xl bg-white border border-[#7f9484] text-base sm:text-sm text-[#162218] placeholder:text-slate-500 focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 focus:outline-none transition-colors"
                />
                {filterState.query ? (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "SET_QUERY", query: "" })}
                    aria-label="খোঁজা মুছুন"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#15803d] hover:bg-[#f3fbf4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d]/35 active:scale-95 motion-reduce:active:transform-none transition-colors cursor-pointer"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <CategorySelect
                id="home-category"
                categories={categoryGroups}
                value={filterState.category}
                onChange={(category) =>
                  dispatch({ type: "SET_CATEGORY", category })
                }
                selectClassName="w-full sm:w-auto"
              />

              <PriceSortSelect
                id="home-sort"
                value={filterState.sortBy}
                onChange={(sortBy) => dispatch({ type: "SET_SORT", sortBy })}
                selectClassName="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>

        {catalogView.status === "upstream-empty" ? (
          <CatalogEmptyPanel
            message="পণ্যের তথ্য পাওয়া যায়নি।"
            actionLabel="আবার চেষ্টা করুন"
            onAction={() => router.refresh()}
          />
        ) : catalogView.status !== "populated" ? (
          <CatalogEmptyPanel
            message={
              catalogView.status === "empty-search"
                ? `“${filterState.query.trim()}” পাওয়া যায়নি।`
                : "এই ফিল্টারে কোনো পণ্য নেই।"
            }
            actionLabel="সব পণ্য দেখুন"
            onAction={() => dispatch({ type: "RESET_FILTERS" })}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {catalogView.visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
