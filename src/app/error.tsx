"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[65vh] max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#162218]">
        তথ্য লোড করা যায়নি
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 h-11 sm:h-10 px-5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-sm leading-none transition-colors cursor-pointer"
        >
          <RefreshCw size={15} aria-hidden="true" />
          <span>আবার চেষ্টা করুন</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 h-11 sm:h-10 px-5 rounded-xl bg-white border border-[#7f9484] hover:border-[#15803d] hover:bg-[#f3fbf4] text-[#162218] hover:text-[#15803d] font-semibold text-sm leading-none transition-colors"
        >
          <Home size={15} aria-hidden="true" />
          <span>হোম পেজ</span>
        </Link>
      </div>
    </div>
  );
}
