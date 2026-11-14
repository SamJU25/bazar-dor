export interface ICategory {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface IMarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface IPriceChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

/** Slimmed product projection passed to list views without large market arrays. */
export interface IProductSummary {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: "kg" | "litre" | "dozen" | "piece" | string;
  image: string;
  today: number;
  yesterday: number;
  change: IPriceChange;
}

/** Minimal product projection serialized into the global marquee ticker. */
export interface ITickerItem {
  id: number;
  slug: string;
  nameBn: string;
  unit: "kg" | "litre" | "dozen" | "piece" | string;
  image: string;
  today: number;
  change: IPriceChange;
}

export interface IProduct extends IProductSummary {
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  markets: IMarketPrice[];
}
