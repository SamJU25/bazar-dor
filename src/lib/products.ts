import type {
  IMarketPrice,
  IPriceChange,
  IProduct,
  IProductSummary,
  ITickerItem,
} from "@/types/bazar";

export type SortOption = "default" | "price-asc" | "price-desc";
export type DirectionFilter = "all" | IPriceChange["dir"];

export interface ProductFilterParams {
  query?: string;
  category?: string;
  direction?: DirectionFilter;
  sortBy?: SortOption;
}

export interface MarketSummary {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  cheapestMarket?: IMarketPrice;
  costliestMarket?: IMarketPrice;
}

/** Strips heavy historical and per-market arrays before serializing product lists to client components. */
export function toProductSummary(
  product: IProduct | IProductSummary,
): IProductSummary {
  return {
    id: product.id,
    slug: product.slug,
    nameBn: product.nameBn,
    category: product.category,
    categoryNameBn: product.categoryNameBn,
    categoryIcon: product.categoryIcon,
    unit: product.unit,
    image: product.image,
    today: product.today,
    yesterday: product.yesterday,
    change: product.change,
  };
}

/** Strips product objects down to the exact fields needed by the live price ticker. */
export function toTickerItem(
  product: IProduct | IProductSummary | ITickerItem,
): ITickerItem {
  return {
    id: product.id,
    slug: product.slug,
    nameBn: product.nameBn,
    unit: product.unit,
    image: product.image,
    today: product.today,
    change: product.change,
  };
}

/** Filters products by search query, category, and price-change direction, then applies numeric sorting. */
export function filterAndSortProducts<T extends IProductSummary>(
  products: readonly T[],
  {
    query = "",
    category = "all",
    direction = "all",
    sortBy = "default",
  }: ProductFilterParams = {},
): T[] {
  const normalized = query.trim().toLowerCase();

  let list = normalized
    ? products.filter(
        (p) =>
          p.nameBn.toLowerCase().includes(normalized) ||
          p.categoryNameBn.toLowerCase().includes(normalized) ||
          p.slug.toLowerCase().includes(normalized),
      )
    : [...products];

  if (category !== "all") {
    list = list.filter((p) => p.category === category);
  }

  if (direction !== "all") {
    list = list.filter((p) => p.change.dir === direction);
  }

  if (sortBy === "price-asc") {
    list.sort((a, b) => Number(a.today) - Number(b.today));
  } else if (sortBy === "price-desc") {
    list.sort((a, b) => Number(b.today) - Number(a.today));
  }

  return list;
}

/** Returns top price risers or fallers sorted by magnitude of percentage change. */
export function getTopMovers<T extends IProductSummary>(
  products: readonly T[],
  dir: "up" | "down",
  limit = 5,
): T[] {
  return products
    .filter((p) => p.change.dir === dir)
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, limit);
}

export interface CategoryProductGroup<
  T extends IProductSummary = IProductSummary,
> {
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  items: T[];
}

/** Groups products by category while preserving first-seen category order. */
export function groupProductsByCategory<T extends IProductSummary>(
  products: readonly T[],
): CategoryProductGroup<T>[] {
  const groups = new Map<string, CategoryProductGroup<T>>();
  for (const product of products) {
    const existing = groups.get(product.category);
    if (existing) {
      existing.items.push(product);
    } else {
      groups.set(product.category, {
        category: product.category,
        categoryNameBn: product.categoryNameBn,
        categoryIcon: product.categoryIcon,
        items: [product],
      });
    }
  }
  return Array.from(groups.values());
}

/** Counts products across all price-movement directions. */
export function getDirectionCounts<T extends IProductSummary>(
  products: readonly T[],
): Record<DirectionFilter, number> {
  const counts: Record<DirectionFilter, number> = {
    all: products.length,
    up: 0,
    down: 0,
    flat: 0,
  };
  for (const product of products) {
    counts[product.change.dir] += 1;
  }
  return counts;
}

/** Computes min, max, average, and extreme market entries for a product. */
export function computeMarketSummary(product: IProduct): MarketSummary {
  const markets = product.markets ?? [];
  if (markets.length === 0) {
    return {
      minPrice: product.today,
      maxPrice: product.today,
      avgPrice: product.today,
    };
  }

  let cheapestMarket = markets[0];
  let costliestMarket = markets[0];
  let midpointSum = 0;

  for (const market of markets) {
    if (market.min < cheapestMarket.min) {
      cheapestMarket = market;
    }
    if (market.max > costliestMarket.max) {
      costliestMarket = market;
    }
    midpointSum += (market.min + market.max) / 2;
  }

  return {
    minPrice: cheapestMarket.min,
    maxPrice: costliestMarket.max,
    avgPrice: midpointSum / markets.length,
    cheapestMarket,
    costliestMarket,
  };
}

type PriceChangeTone = "light" | "dark" | "inline" | "inline-dark";

const PRICE_CHANGE_STYLES: Record<
  PriceChangeTone,
  Record<IPriceChange["dir"], string>
> = {
  light: {
    up: "bg-[#ecfdf5] text-[#166534]",
    down: "bg-[#fff1f2] text-[#b91c1c]",
    flat: "bg-slate-100 text-slate-700",
  },
  dark: {
    up: "bg-emerald-500/20 text-emerald-300",
    down: "bg-rose-500/20 text-rose-300",
    flat: "bg-slate-500/25 text-slate-200",
  },
  inline: {
    up: "text-[#15803d]",
    down: "text-[#b91c1c]",
    flat: "text-slate-600",
  },
  "inline-dark": {
    up: "text-emerald-300",
    down: "text-rose-300",
    flat: "text-slate-300",
  },
};

/** Returns consistent styling for price movement indicators across badge and table cells. */
export function getPriceChangeClasses(
  dir: IPriceChange["dir"],
  tone: PriceChangeTone = "light",
): string {
  return PRICE_CHANGE_STYLES[tone][dir];
}
