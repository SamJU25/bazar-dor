export default function ProductDetailsLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="পণ্যের বিস্তারিত লোড হচ্ছে"
      className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-9 space-y-6 animate-pulse motion-reduce:animate-none"
    >
      <div className="h-5 w-48 rounded-lg bg-[#e8efe8]" />
      <div className="h-32 rounded-2xl bg-white border border-[#dce6dc]" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 rounded-2xl bg-white border border-[#dce6dc]" />
        <div className="h-24 rounded-2xl bg-white border border-[#dce6dc]" />
        <div className="h-24 rounded-2xl bg-white border border-[#dce6dc]" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="h-24 rounded-2xl bg-white border border-[#dce6dc]" />
        <div className="h-24 rounded-2xl bg-white border border-[#dce6dc]" />
        <div className="h-24 rounded-2xl bg-white border border-[#dce6dc]" />
        <div className="h-24 rounded-2xl bg-white border border-[#dce6dc]" />
      </div>
      <div className="h-72 rounded-2xl bg-white border border-[#dce6dc]" />
    </div>
  );
}
