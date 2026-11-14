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
              className="btn-primary gap-1.5 h-11 sm:h-10 px-4 sm:px-5 rounded-xl"
            >
              <span>সব পণ্য দেখুন</span>
              <ArrowDown
                size={16}
                strokeWidth={2.1}
                aria-hidden="true"
                className="shrink-0"
              />
            </a>

            <a
              href="#দর-পরিবর্তন"
              className="btn-secondary h-11 sm:h-10 px-4 rounded-xl"
            >
              আজকের দর পরিবর্তন
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
