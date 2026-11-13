import HeroSection from "@/components/HeroSection";
import HomeSections from "@/components/HomeSections";
import { getProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <HeroSection />
      <HomeSections products={products} />
    </div>
  );
}
