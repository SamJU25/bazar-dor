import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import BnNumber from "@/components/BnNumber";
import CategoryProducts from "@/components/CategoryProducts";
import {
  getCachedCategories,
  getCachedCategoryPageData,
} from "@/lib/catalog";
import { toProductSummary } from "@/lib/products";

export async function generateStaticParams() {
  const categories = await getCachedCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { category } = await getCachedCategoryPageData(slug);
    if (!category) {
      return { title: { absolute: "বাজার দর" } };
    }
    const description = `${category.nameBn} ক্যাটাগরির আজকের বাজারদর, দাম বৃদ্ধি-হ্রাস এবং বাজারভিত্তিক তুলনা।`;
    return {
      title: category.nameBn,
      description,
      alternates: {
        canonical: `/category/${category.slug}`,
      },
      openGraph: {
        title: `${category.nameBn} | বাজার দর`,
        description,
        url: `/category/${category.slug}`,
      },
      twitter: {
        title: `${category.nameBn} | বাজার দর`,
        description,
      },
    };
  } catch {
    return { title: { absolute: "বাজার দর" } };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { category, products } = await getCachedCategoryPageData(slug);

  if (!category) {
    notFound();
  }

  const summaries = products.map(toProductSummary);

  return (
    <div className="w-full py-6 sm:py-8 bg-[#f8faf8]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-6">
        <nav
          aria-label="ব্রেডক্রাম্ব"
          className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[#15803d] transition-colors"
          >
            <Home size={14} aria-hidden="true" />
            <span>হোম</span>
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="font-semibold text-[#162218]">
            {category.nameBn}
          </span>
        </nav>

        <div className="flex items-center gap-3.5 pb-5 border-b border-[#dce6dc]">
          <span
            aria-hidden="true"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#dce6dc] flex items-center justify-center text-2xl sm:text-3xl shrink-0"
          >
            {category.icon}
          </span>
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#162218]">
              {category.nameBn}
            </h1>
            <span className="text-sm font-medium text-slate-600 tabular-nums">
              <BnNumber value={summaries.length} />টি পণ্য
            </span>
          </div>
        </div>

        <CategoryProducts products={summaries} />
      </div>
    </div>
  );
}
