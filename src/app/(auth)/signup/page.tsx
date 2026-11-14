import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthSuspenseFallback } from "@/components/AuthFormShell";
import SignUpForm from "@/components/SignUpForm";

export const metadata: Metadata = {
  title: "সাইন আপ",
  description:
    "নতুন বাজার দর অ্যাকাউন্ট তৈরি করে সকল পণ্যের বাজারভিত্তিক তথ্য ও দাম দেখুন।",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <SignUpForm />
    </Suspense>
  );
}
