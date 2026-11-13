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

export interface IProduct {
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
  lastWeek: number;
  lastMonth: number;
  change: IPriceChange;
  markets: IMarketPrice[];
}
