"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ICategory } from "@/types/bazar";

function getNavLinkClass(isActive: boolean): string {
  return `group relative inline-flex items-center h-10 xl:h-full px-0.5 text-xs sm:text-sm leading-snug whitespace-nowrap focus-visible:outline-none transition-colors shrink-0 first:xl:ml-auto last:xl:mr-auto ${
    isActive
      ? "text-[#15803d] font-semibold after:content-[''] after:absolute after:inset-x-1.5 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#15803d]"
      : "text-slate-700 hover:text-[#15803d] font-medium"
  }`;
}

const NAV_LABEL_CLASS =
  "px-2.5 py-1.5 rounded-lg transition-colors group-hover:bg-[#f3fbf4] group-focus-visible:ring-2 group-focus-visible:ring-[#15803d]";

interface NavbarCategoryLinksProps {
  categories: ICategory[];
}

export default function NavbarCategoryLinks({
  categories,
}: NavbarCategoryLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="পণ্যের বিভাগসমূহ"
      className="order-4 xl:order-2 -mx-4 px-4 sm:mx-0 sm:px-0 w-[calc(100%+2rem)] sm:w-full xl:w-auto xl:flex-1 xl:min-w-0 xl:self-stretch flex items-center gap-0.5 sm:gap-1 pt-1 pb-0 xl:py-0 overflow-x-auto no-scrollbar"
    >
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className={getNavLinkClass(pathname === "/")}
      >
        <span className={NAV_LABEL_CLASS}>সব পণ্য</span>
      </Link>

      {categories.map((cat) => {
        const isActive = pathname === `/category/${cat.slug}`;
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={getNavLinkClass(isActive)}
          >
            <span className={NAV_LABEL_CLASS}>{cat.nameBn}</span>
          </Link>
        );
      })}
    </nav>
  );
}
