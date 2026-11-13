import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function CategoryLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="বিভাগের পণ্য লোড হচ্ছে"
      className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-6"
    >
      <div className="h-4 w-36 rounded-lg bg-[#e8efe8] animate-pulse motion-reduce:animate-none" />
      <div className="h-24 rounded-2xl bg-white border border-[#dce6dc] animate-pulse motion-reduce:animate-none" />
      <div className="h-12 rounded-2xl bg-white border border-[#dce6dc] animate-pulse motion-reduce:animate-none" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
