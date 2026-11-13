import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি | বাজার দর",
  description:
    "বাজার দর অ্যাপ্লিকেশনের গোপনীয়তা নীতি এবং ব্যবহারকারীর তথ্য মুছে ফেলার নির্দেশনা।",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] w-full bg-[#f8faf8] py-8 sm:py-10 px-4 sm:px-6 lg:px-10 xl:px-12">
      <div className="max-w-3xl mx-auto space-y-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#15803d] transition-colors w-fit"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>

        <article className="bg-white rounded-2xl border border-[#dce6dc] p-6 sm:p-8 space-y-6">
          <header className="space-y-2 border-b border-[#e8efe8] pb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#162218]">
              গোপনীয়তা নীতি (Privacy Policy)
            </h1>
            <p className="text-sm text-slate-600">
              বাজার দর (BazarDor) আপনার ব্যক্তিগত তথ্যের গোপনীয়তা ও সুরক্ষাকে
              গুরুত্ব দেয়।
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#162218]">
              ১. আমরা কী তথ্য সংগ্রহ করি
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              সাইন আপ বা ইমেইল, Google অথবা Facebook দিয়ে সাইন ইন করার সময় আমরা
              শুধুমাত্র আপনার নাম, ইমেইল ঠিকানা এবং (প্রযোজ্য ক্ষেত্রে) প্রোফাইল
              ছবি সংরক্ষণ করি। পণ্যের মূল্য তালিকা ব্রাউজ করার জন্য কোনো
              ব্যক্তিগত তথ্যের প্রয়োজন হয় না।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#162218]">
              ২. তথ্য ব্যবহারের উদ্দেশ্য
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              সংগ্রহ করা তথ্য শুধুমাত্র আপনার অ্যাকাউন্ট যাচাইকরণ, নিরাপদ সাইন-ইন
              সেশন বজায় রাখা এবং পণ্যের বিস্তারিত বাজারভিত্তিক তথ্য ও প্রোফাইল
              ব্যবস্থাপনার জন্য ব্যবহৃত হয়। আমরা কোনো তৃতীয় পক্ষের কাছে আপনার
              তথ্য বিক্রি বা বাণিজ্যিকভাবে শেয়ার করি না।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#162218]">
              ৩. কুকি ও সেশন নিরাপত্তা
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              সাইন-ইন অবস্থা ধরে রাখার জন্য প্রয়োজনীয় এনক্রিপ্টেড সেশন কুকি
              ব্যবহার করা হয়। আপনি যেকোনো সময় নেভিগেশন মেনু থেকে সাইন আউট করে
              আপনার বর্তমান সেশন শেষ করতে পারেন।
            </p>
          </section>

          <section
            id="data-deletion"
            className="space-y-2 pt-4 border-t border-[#e8efe8] scroll-mt-24"
          >
            <h2 className="text-lg font-bold text-[#162218]">
              ৪. তথ্য পরিবর্তন ও মুছে ফেলার নির্দেশনা (Data Deletion)
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              আপনি লগ ইন অবস্থায়{" "}
              <Link
                href="/profile/update-profile"
                className="font-semibold text-[#15803d] hover:underline"
              >
                প্রোফাইল আপডেট
              </Link>{" "}
              পাতা থেকে আপনার নাম পরিবর্তন করতে পারেন।
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Facebook লগইন সংযোগ বিচ্ছিন্ন করতে ও আপনার অনুমতি প্রত্যাহার করতে:
              Facebook-এর <strong>Settings &amp; Privacy → Settings → Apps and
              Websites</strong> এ গিয়ে <strong>BazarDor</strong> নির্বাচন করে{" "}
              <strong>Remove</strong> বাটনে ক্লিক করুন।
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
