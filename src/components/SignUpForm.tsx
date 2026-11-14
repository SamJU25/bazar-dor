"use client";

import React, { useEffect, useReducer, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Loader2, Mail, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import {
  AUTH_INPUT_CLASS,
  AuthErrorAlert,
  AuthPageShell,
  AuthPasswordField,
} from "@/components/AuthFormShell";
import { signUp } from "@/lib/auth-client";
import {
  buildAuthUrl,
  formatAuthActionError,
  getSafeCallbackUrl,
} from "@/lib/auth-helpers";
import { asyncActionReducer, isActionBusy } from "@/lib/state-machines";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitState, dispatch] = useReducer(asyncActionReducer, {
    status: "idle",
  });
  const isBusy = isActionBusy(submitState);

  useEffect(() => {
    const resetOnBfcache = (event: PageTransitionEvent) => {
      if (event.persisted) {
        dispatch({ type: "RESET" });
      }
    };
    window.addEventListener("pageshow", resetOnBfcache);
    return () => window.removeEventListener("pageshow", resetOnBfcache);
  }, []);

  const clearErrorOnEdit = (field?: string) => {
    if (field && fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submitState.status === "error") {
      dispatch({ type: "RESET" });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBusy) return;

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").replace(/\s+/g, " ").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    const nextErrors: Record<string, string> = {};
    if (name.length < 2) {
      nextErrors.name = "নাম কমপক্ষে ২ অক্ষরের হতে হবে";
    } else if (name.length > 80) {
      nextErrors.name = "নাম সর্বোচ্চ ৮০ অক্ষরের মধ্যে হতে হবে";
    }

    if (!email) {
      nextErrors.email = "ইমেইল ঠিকানা লিখুন";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "সঠিক ইমেইল ঠিকানা দিন";
    }

    if (password.length < 8) {
      nextErrors.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
    } else if (password.length > 128) {
      nextErrors.password = "পাসওয়ার্ড সর্বোচ্চ ১২৮ অক্ষরের মধ্যে হতে হবে";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "পাসওয়ার্ডটি পুনরায় লিখুন";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "পাসওয়ার্ড দুটি মিলছে না";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      const firstMessage =
        nextErrors.confirmPassword ||
        nextErrors.password ||
        nextErrors.email ||
        nextErrors.name ||
        "সবগুলো ঘর সঠিকভাবে পূরণ করুন";
      dispatch({ type: "FAIL", message: firstMessage });
      toast.error(firstMessage);
      return;
    }

    setFieldErrors({});
    dispatch({ type: "SUBMIT" });
    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        const message = formatAuthActionError(
          error.message || error.code,
          "অ্যাকাউন্ট তৈরি করা যায়নি",
        );
        dispatch({ type: "FAIL", message });
        toast.error(message);
        return;
      }

      dispatch({ type: "SUCCEED" });
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন");
      router.push(buildAuthUrl("/signin", callbackUrl));
    } catch {
      const message = "নিবন্ধন করার সময় সমস্যা হয়েছে";
      dispatch({ type: "FAIL", message });
      toast.error(message);
    }
  };

  return (
    <AuthPageShell
      title="অ্যাকাউন্ট তৈরি করুন"
      callbackUrl={callbackUrl}
      footerPrompt="অ্যাকাউন্ট আছে?"
      footerLinkLabel="সাইন ইন করুন"
      footerLinkHref={buildAuthUrl("/signin", callbackUrl)}
    >
      <Form
        data-state={submitState.status}
        validationBehavior="aria"
        validationErrors={fieldErrors}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <TextField
          name="name"
          type="text"
          isRequired
          onChange={() => clearErrorOnEdit("name")}
          className="flex flex-col gap-1.5 w-full"
        >
          <Label className="text-xs sm:text-sm font-semibold text-slate-700">
            নাম
          </Label>
          <div className="relative flex items-center">
            <UserIcon
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 text-slate-500"
            />
            <Input
              placeholder="যেমন: রহিম উদ্দিন"
              autoComplete="name"
              maxLength={80}
              className={AUTH_INPUT_CLASS}
            />
          </div>
          <FieldError className="text-xs text-[#b91c1c]" />
        </TextField>

        <TextField
          name="email"
          type="email"
          isRequired
          onChange={() => clearErrorOnEdit("email")}
          className="flex flex-col gap-1.5 w-full"
        >
          <Label className="text-xs sm:text-sm font-semibold text-slate-700">
            ইমেইল
          </Label>
          <div className="relative flex items-center">
            <Mail
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 text-slate-500"
            />
            <Input
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={254}
              className={AUTH_INPUT_CLASS}
            />
          </div>
          <FieldError className="text-xs text-[#b91c1c]" />
        </TextField>

        <AuthPasswordField
          name="password"
          label="পাসওয়ার্ড"
          placeholder="কমপক্ষে ৮ অক্ষর"
          autoComplete="new-password"
          minLength={8}
          onChange={() => clearErrorOnEdit("password")}
        />

        <AuthPasswordField
          name="confirmPassword"
          label="পাসওয়ার্ড নিশ্চিত করুন"
          placeholder="আবার লিখুন"
          autoComplete="new-password"
          minLength={8}
          onChange={() => clearErrorOnEdit("confirmPassword")}
        />

        <AuthErrorAlert
          message={submitState.status === "error" ? submitState.message : null}
        />

        <Button
          type="submit"
          isDisabled={isBusy}
          aria-busy={isBusy}
          className="btn-primary w-full h-11 mt-1 rounded-xl"
        >
          {isBusy ? (
            <>
              <Loader2
                size={16}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
              <span>তৈরি হচ্ছে...</span>
            </>
          ) : (
            <span>সাইন আপ</span>
          )}
        </Button>
      </Form>
    </AuthPageShell>
  );
}
