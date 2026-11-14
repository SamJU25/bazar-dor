"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  FieldError,
  Input,
  Label,
  Separator,
  TextField,
} from "@heroui/react";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import SocialAuthButtons from "@/components/SocialAuthButtons";

const INPUT_BASE_CLASS =
  "w-full h-11 pl-10 rounded-xl bg-white hover:bg-white focus:bg-white shadow-none border border-[#7f9484] hover:border-[#15803d] focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 focus:outline-none text-base sm:text-sm text-[#162218] placeholder:text-slate-500 transition-colors";

export const AUTH_INPUT_CLASS = `${INPUT_BASE_CLASS} pr-3.5`;
const AUTH_PASSWORD_INPUT_CLASS = `${INPUT_BASE_CLASS} pr-11`;

/** Shared alert banner for form and OAuth errors. */
export function AuthErrorAlert({
  message,
  compact = false,
}: {
  message: string | null | undefined;
  compact?: boolean;
}) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={`rounded-xl bg-[#fff1f2] border border-[#fecdd3] px-3.5 py-2 font-medium text-[#991b1b] ${
        compact ? "text-xs" : "text-xs sm:text-sm"
      }`}
    >
      {message}
    </p>
  );
}

/** Shared prompt shown on client-protected routes when no session is active. */
export function AuthRequiredNotice({
  state,
  signInHref = "/signin",
}: {
  state: string;
  signInHref?: string;
}) {
  return (
    <div
      data-state={state}
      className="max-w-lg mx-auto px-4 py-16 text-center space-y-4"
    >
      <h1 className="text-2xl font-bold text-[#162218]">
        সাইন ইন করা প্রয়োজন
      </h1>
      <Link
        href={signInHref}
        className="btn-primary h-11 px-6 rounded-xl"
      >
        সাইন ইন করুন
      </Link>
    </div>
  );
}

interface AuthPageShellProps {
  title: string;
  callbackUrl: string;
  footerPrompt: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  children: React.ReactNode;
}

/** Shared flat-surface card layout for Sign In and Sign Up pages. */
export function AuthPageShell({
  title,
  callbackUrl,
  footerPrompt,
  footerLinkLabel,
  footerLinkHref,
  children,
}: AuthPageShellProps) {
  return (
    <div className="min-h-[calc(100vh-140px)] w-full flex flex-col items-center justify-center bg-[#f8faf8] px-4 py-8 sm:py-10">
      <div className="w-full max-w-[440px] space-y-4">
        <Link href="/" className="link-back text-xs sm:text-sm">
          <ArrowLeft size={15} aria-hidden="true" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>

        <Card className="w-full p-5 sm:p-7 rounded-2xl border border-[#dce6dc] bg-white shadow-none gap-0">
          <Card.Header className="p-0 pb-5 flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-[#162218]">{title}</h1>
          </Card.Header>

          <Card.Content className="flex flex-col gap-5 p-0">
            {children}

            <div className="flex items-center gap-3">
              <Separator className="flex-1 bg-[#dce6dc]" />
              <span className="text-xs text-slate-600 font-medium">অথবা</span>
              <Separator className="flex-1 bg-[#dce6dc]" />
            </div>

            <SocialAuthButtons callbackURL={callbackUrl} />

            <p className="text-center text-xs sm:text-sm text-slate-600">
              {footerPrompt}{" "}
              <Link
                href={footerLinkHref}
                className="font-semibold text-[#15803d] hover:underline"
              >
                {footerLinkLabel}
              </Link>
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

interface AuthPasswordFieldProps {
  name: string;
  label: string;
  placeholder: string;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  onChange: () => void;
}

/** Password input with independent visibility toggle and consistent sage focus/hover styling. */
export function AuthPasswordField({
  name,
  label,
  placeholder,
  autoComplete,
  minLength,
  onChange,
}: AuthPasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      name={name}
      type={isVisible ? "text" : "password"}
      isRequired
      minLength={minLength}
      onChange={onChange}
      className="flex flex-col gap-1.5 w-full"
    >
      <Label className="text-xs sm:text-sm font-semibold text-slate-700">
        {label}
      </Label>
      <div className="relative flex items-center">
        <Lock
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 text-slate-500"
        />
        <Input
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={AUTH_PASSWORD_INPUT_CLASS}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute right-1.5 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#15803d] hover:bg-[#f3fbf4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d]/35 active:scale-95 motion-reduce:active:transform-none transition-colors cursor-pointer"
          aria-pressed={isVisible}
          aria-label={isVisible ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
        >
          {isVisible ? (
            <EyeOff size={17} aria-hidden="true" />
          ) : (
            <Eye size={17} aria-hidden="true" />
          )}
        </button>
      </div>
      <FieldError className="text-xs text-red-700" />
    </TextField>
  );
}

export function AuthSuspenseFallback() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#f8faf8] flex items-center justify-center">
      <Loader2
        size={28}
        aria-hidden="true"
        className="animate-spin text-[#15803d]"
      />
    </div>
  );
}
