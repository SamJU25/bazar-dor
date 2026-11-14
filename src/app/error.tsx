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
          className="btn-primary h-11 sm:h-10 px-5 rounded-xl"
        >
          <RefreshCw size={16} aria-hidden="true" />
          <span>আবার চেষ্টা করুন</span>
        </button>
        <Link
          href="/"
          className="btn-secondary h-11 sm:h-10 px-5 rounded-xl"
        >
          <Home size={16} aria-hidden="true" />
          <span>হোম পেজ</span>
        </Link>
      </div>
    </div>
  );
}
