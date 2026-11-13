import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function HomeLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="পণ্য তালিকা লোড হচ্ছে"
      className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 lg:py-10 space-y-8"
    >
      <div className="h-40 rounded-2xl bg-white border border-[#dce6dc] animate-pulse motion-reduce:animate-none" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 rounded-2xl bg-white border border-[#dce6dc] animate-pulse motion-reduce:animate-none" />
        <div className="h-72 rounded-2xl bg-white border border-[#dce6dc] animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="space-y-4">
        <div className="h-7 w-40 rounded-xl bg-[#e8efe8] animate-pulse motion-reduce:animate-none" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
