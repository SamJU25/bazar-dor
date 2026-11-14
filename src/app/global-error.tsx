"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical application error:", error);
  }, [error]);

  return (
    <html lang="bn">
      <body className="min-h-screen bg-[#f8faf8] text-[#162218] font-sans flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#dce6dc] p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#162218]">
            অ্যাপ্লিকেশন লোড করতে সমস্যা হয়েছে
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            দুঃখিত, অপ্রত্যাশিত ত্রুটির কারণে পৃষ্ঠাটি প্রদর্শন করা যায়নি। আবার চেষ্টা করুন।
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-sm font-semibold cursor-pointer"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </body>
    </html>
  );
}
