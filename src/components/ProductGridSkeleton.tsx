export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-white border border-[#dce6dc] p-4 sm:p-5 flex flex-col justify-between gap-4 animate-pulse motion-reduce:animate-none"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#eef3ee] shrink-0" />
            <div className="space-y-1.5 flex-1 pt-0.5">
              <div className="h-4 w-28 rounded bg-[#eef3ee]" />
              <div className="h-3 w-20 rounded bg-[#eef3ee]" />
            </div>
          </div>
          <div className="pt-3 border-t border-[#e8efe8] flex items-end justify-between gap-2">
            <div className="h-5 w-20 rounded bg-[#eef3ee]" />
            <div className="h-4 w-24 rounded bg-[#eef3ee]" />
          </div>
        </div>
      ))}
    </div>
  );
}
