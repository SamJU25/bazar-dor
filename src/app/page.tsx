import HeroSection from "@/components/HeroSection";
import HomeSections from "@/components/HomeSections";
import { getCachedProducts } from "@/lib/catalog";
import { toProductSummary } from "@/lib/products";

export default async function HomePage() {
  const products = (await getCachedProducts()).map(toProductSummary);

  return (
    <div>
      <HeroSection />
      <HomeSections products={products} />
    </div>
  );
}
