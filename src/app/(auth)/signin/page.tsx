import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthSuspenseFallback } from "@/components/AuthFormShell";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "সাইন ইন",
  description:
    "বাজার দর অ্যাকাউন্টে সাইন ইন করে পণ্যের বাজারভিত্তিক দাম ও বিস্তারিত বিশ্লেষণ দেখুন।",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <SignInForm />
    </Suspense>
  );
}
