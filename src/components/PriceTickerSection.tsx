import PriceTicker from "@/components/PriceTicker";
import { getCachedProducts } from "@/lib/catalog";
import { toTickerItem } from "@/lib/products";

export function PriceTickerSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full h-10 bg-[#162218] border-b border-emerald-950/60"
    />
  );
}

export default async function PriceTickerSection() {
  const products = await getCachedProducts();
  if (!products.length) return null;

  const movers = products
    .filter((p) => p.change.dir !== "flat")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct));
  const selected = (movers.length >= 10 ? movers : products)
    .slice(0, 14)
    .map(toTickerItem);

  return <PriceTicker items={selected} />;
}
