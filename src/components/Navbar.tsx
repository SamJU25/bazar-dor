import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import NavbarAuthMenu from "@/components/NavbarAuthMenu";
import NavbarCategoryLinks from "@/components/NavbarCategoryLinks";
import NavbarDate from "@/components/NavbarDate";
import type { ICategory } from "@/types/bazar";

interface NavbarProps {
  categories: ICategory[];
  initialDate: string;
}

export default function Navbar({ categories, initialDate }: NavbarProps) {
  return (
    <header className="w-full bg-white border-b border-[#dce6dc] sticky top-0 z-50">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-wrap xl:flex-nowrap items-center xl:items-stretch justify-between gap-x-2.5 sm:gap-x-3 xl:gap-x-5">
          <div className="order-1 flex-1 xl:flex-initial flex flex-col justify-center gap-1 min-w-0 py-2.5 sm:py-3 xl:py-2.5">
            <Link href="/" className="flex items-center gap-2 w-fit group">
              <BrandLogo className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="text-xl sm:text-2xl font-bold text-[#15803d] tracking-tight leading-none">
                বাজার দর
              </span>
            </Link>

            <NavbarDate initialDate={initialDate} />
          </div>

          <NavbarAuthMenu />

          <div
            aria-hidden="true"
            className="order-3 h-px w-full bg-[#e5ece5] xl:hidden"
          />

          <NavbarCategoryLinks categories={categories} />
        </div>
      </div>
    </header>
  );
}
