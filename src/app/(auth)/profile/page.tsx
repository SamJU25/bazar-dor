"use client";

import Link from "next/link";
import { Avatar, Card, Separator } from "@heroui/react";
import { ArrowLeft, Edit3, Loader2, Mail, User as UserIcon } from "lucide-react";
import { AuthRequiredNotice } from "@/components/AuthFormShell";
import { useSession } from "@/lib/auth-client";
import { getUserInitials } from "@/lib/auth-helpers";
import { resolveSessionGateState } from "@/lib/state-machines";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const gate = resolveSessionGateState(isPending, session?.user);

  if (gate.status === "loading") {
    return (
      <div
        data-state={gate.status}
        aria-busy="true"
        className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-600"
      >
        <Loader2 size={28} aria-hidden="true" className="animate-spin text-[#15803d]" />
        <p className="text-sm font-medium">প্রোফাইল তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (gate.status === "unauthenticated") {
    return <AuthRequiredNotice state={gate.status} />;
  }

  const user = gate.user;
  const initials = getUserInitials(user.name);

  return (
    <div
      data-state={gate.status}
      className="min-h-[calc(100vh-140px)] w-full bg-[#f8faf8] px-4 py-10"
    >
      <div className="max-w-xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#15803d] transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>

        <Card className="bg-white rounded-2xl border border-[#dce6dc] shadow-none gap-0 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Avatar className="w-20 h-20 text-2xl border border-[#dce6dc]">
              {user.image ? (
                <Avatar.Image alt={user.name || "User"} src={user.image} />
              ) : null}
              <Avatar.Fallback className="bg-[#15803d] text-white font-semibold">
                {initials}
              </Avatar.Fallback>
            </Avatar>

            <div>
              <h1 className="text-2xl font-bold text-[#162218]">
                {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">{user.email}</p>
            </div>
          </div>

          <Separator className="bg-[#dce6dc]" />

          <div className="divide-y divide-[#eef3ee] rounded-xl border border-[#dce6dc] bg-[#f8faf8]">
            <div className="flex items-center gap-3 px-4 py-3">
              <UserIcon size={17} aria-hidden="true" className="text-[#15803d] shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  নাম
                </span>
                <span className="text-sm font-semibold text-[#162218]">
                  {user.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
              <Mail size={17} aria-hidden="true" className="text-[#15803d] shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  ইমেইল
                </span>
                <span className="text-sm font-semibold text-[#162218]">
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/profile/update-profile"
              className="w-full h-11 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-sm leading-none transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 size={16} aria-hidden="true" />
              <span>তথ্য আপডেট করুন</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
