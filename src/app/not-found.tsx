import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[65vh] max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center space-y-4">
      <p className="text-sm font-semibold text-[#15803d]">৪০৪</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#162218]">
        পৃষ্ঠাটি পাওয়া যায়নি
      </h1>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-11 sm:h-10 px-6 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-sm leading-none transition-colors"
        >
          <Home size={15} aria-hidden="true" />
          <span>হোম পেজ</span>
        </Link>
      </div>
    </div>
  );
}
