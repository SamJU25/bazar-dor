"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isRetrying, startTransition] = useTransition();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className="min-h-[65vh] max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#162218]">
        তথ্য লোড করা যায়নি
      </h1>
      <p className="text-sm sm:text-base text-slate-600 max-w-md">
        সাময়িক নেটওয়ার্ক বা সার্ভার সমস্যার কারণে তথ্য দেখানো যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          aria-busy={isRetrying}
          className="btn-primary h-11 sm:h-10 px-5 rounded-xl"
        >
          <RefreshCw
            size={16}
            className={isRetrying ? "animate-spin motion-reduce:animate-none" : ""}
            aria-hidden="true"
          />
          <span>{isRetrying ? "চেষ্টা করা হচ্ছে..." : "আবার চেষ্টা করুন"}</span>
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
