"use client";

import Link from "next/link";
import { Avatar, Card, Separator } from "@heroui/react";
import { ArrowLeft, Edit3, Mail, User as UserIcon } from "lucide-react";
import { getUserInitials } from "@/lib/auth-helpers";

interface ProfileCardProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const displayName = user.name || "ব্যবহারকারী";
  const initials = getUserInitials(user.name);

  return (
    <div
      data-state="authenticated"
      className="w-full bg-[#f8faf8] px-4 py-8 sm:py-10"
    >
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/" className="link-back text-xs sm:text-sm">
          <ArrowLeft size={15} aria-hidden="true" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>

        <Card className="bg-white rounded-2xl border border-[#dce6dc] shadow-none gap-0 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Avatar className="w-20 h-20 text-2xl border border-[#dce6dc] shrink-0">
              {user.image ? (
                <Avatar.Image alt={displayName} src={user.image} />
              ) : null}
              <Avatar.Fallback className="bg-[#15803d] text-white font-semibold">
                {initials}
              </Avatar.Fallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-[#162218] break-words">
                {displayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 break-all">
                {user.email}
              </p>
            </div>
          </div>

          <Separator className="bg-[#dce6dc]" />

          <div className="divide-y divide-[#eef3ee] rounded-xl border border-[#dce6dc] bg-[#f8faf8]">
            <div className="flex items-center gap-3 px-4 py-3">
              <UserIcon
                size={17}
                aria-hidden="true"
                className="text-[#15803d] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-slate-600 block">
                  নাম
                </span>
                <span className="text-sm font-semibold text-[#162218] break-words">
                  {displayName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
              <Mail
                size={17}
                aria-hidden="true"
                className="text-[#15803d] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-slate-600 block">
                  ইমেইল
                </span>
                <span className="text-sm font-semibold text-[#162218] break-all">
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/profile/update-profile"
              className="btn-primary w-full h-11 rounded-xl"
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
