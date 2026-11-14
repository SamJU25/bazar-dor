import { Suspense } from "react";
import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import ClientToaster from "@/components/ClientToaster";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PriceTickerSection, {
  PriceTickerSkeleton,
} from "@/components/PriceTickerSection";
import { getCachedCategories } from "@/lib/catalog";
import { formatDhakaDateBn } from "@/lib/format";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-bengali",
});

const SITE_DESCRIPTION =
  "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্য: চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের বাজারদর, দামের পরিবর্তন এবং বাজারভিত্তিক তুলনা।";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "বাজার দর | প্রতিদিনের নিত্যপণ্যের হালনাগাদ দাম",
    template: "%s | বাজার দর",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "বাজার দর",
    title: "বাজার দর | প্রতিদিনের নিত্যপণ্যের হালনাগাদ দাম",
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "বাজার দর | প্রতিদিনের নিত্যপণ্যের হালনাগাদ দাম",
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCachedCategories();
  const initialDate = formatDhakaDateBn();

  return (
    <html
      lang="bn"
      className={`${notoSansBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f8faf8] text-[#162218]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#15803d] focus:text-white focus:text-sm focus:font-semibold"
        >
          মূল বিষয়বস্তুতে যান
        </a>
        <Navbar categories={categories} initialDate={initialDate} />
        <Suspense fallback={<PriceTickerSkeleton />}>
          <PriceTickerSection />
        </Suspense>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <ClientToaster />
      </body>
    </html>
  );
}
