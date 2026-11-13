import { ArrowDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="w-full bg-white border-b border-[#dce6dc]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-5 sm:py-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
          <div className="flex flex-col items-start gap-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#162218] leading-tight tracking-tight">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium">
              নিত্যপণ্যের আজকের বাজারদর ও গতকালের তুলনা
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="#সব-পণ্য"
              className="inline-flex items-center justify-center gap-1.5 h-11 sm:h-10 px-4 sm:px-5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-sm font-semibold leading-none transition-colors"
            >
              <span>সব পণ্য দেখুন</span>
              <ArrowDown
                size={15}
                strokeWidth={2.25}
                aria-hidden="true"
                className="shrink-0"
              />
            </a>

            <a
              href="#দর-পরিবর্তন"
              className="inline-flex items-center justify-center h-11 sm:h-10 px-4 rounded-xl bg-white border border-[#7f9484] hover:border-[#15803d] hover:bg-[#f3fbf4] text-[#162218] hover:text-[#15803d] text-sm font-semibold leading-none transition-colors"
            >
              আজকের দর পরিবর্তন
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
