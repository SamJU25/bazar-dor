import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#dce6dc] mt-auto">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-2 min-h-10 px-1 text-sm font-semibold text-[#162218] hover:text-[#15803d] transition-colors"
        >
          <BrandLogo className="w-5 h-5" />
          <span>বাজার দর</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-slate-600">
          <Link
            href="/privacy"
            className="inline-flex items-center min-h-10 px-1 font-medium hover:text-[#15803d] transition-colors"
          >
            গোপনীয়তা নীতি
          </Link>
          <span aria-hidden="true" className="text-slate-300">
            |
          </span>
          <p>বাজারদর পরিবর্তনশীল</p>
        </div>
      </div>
    </footer>
  );
}
