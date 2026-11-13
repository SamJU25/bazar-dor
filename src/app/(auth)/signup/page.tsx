"use client";

import React, { Suspense, useReducer } from "react";
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
  AuthSuspenseFallback,
} from "@/components/AuthFormShell";
import { signUp } from "@/lib/auth-client";
import { buildAuthUrl, getSafeCallbackUrl } from "@/lib/auth-helpers";
import { asyncActionReducer, isActionBusy } from "@/lib/state-machines";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const [submitState, dispatch] = useReducer(asyncActionReducer, {
    status: "idle",
  });
  const isBusy = isActionBusy(submitState);

  const clearErrorOnEdit = () => {
    if (submitState.status === "error") {
      dispatch({ type: "RESET" });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBusy) return;

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!name || !email || !password || !confirmPassword) {
      const message = "সবগুলো ঘর সঠিকভাবে পূরণ করুন";
      dispatch({ type: "FAIL", message });
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
      dispatch({ type: "FAIL", message });
      toast.error(message);
      return;
    }

    if (password !== confirmPassword) {
      const message = "পাসওয়ার্ড দুটি মিলছে না";
      dispatch({ type: "FAIL", message });
      toast.error(message);
      return;
    }

    dispatch({ type: "SUBMIT" });
    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        const message = error.message || "অ্যাকাউন্ট তৈরি করা যায়নি";
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
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <TextField
          name="name"
          type="text"
          isRequired
          onChange={clearErrorOnEdit}
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
              className={AUTH_INPUT_CLASS}
            />
          </div>
          <FieldError className="text-xs text-red-700" />
        </TextField>

        <TextField
          name="email"
          type="email"
          isRequired
          onChange={clearErrorOnEdit}
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
              className={AUTH_INPUT_CLASS}
            />
          </div>
          <FieldError className="text-xs text-red-700" />
        </TextField>

        <AuthPasswordField
          name="password"
          label="পাসওয়ার্ড"
          placeholder="কমপক্ষে ৮ অক্ষর"
          autoComplete="new-password"
          minLength={8}
          onChange={clearErrorOnEdit}
        />

        <AuthPasswordField
          name="confirmPassword"
          label="পাসওয়ার্ড নিশ্চিত করুন"
          placeholder="আবার লিখুন"
          autoComplete="new-password"
          minLength={8}
          onChange={clearErrorOnEdit}
        />

        <AuthErrorAlert
          message={submitState.status === "error" ? submitState.message : null}
        />

        <Button
          type="submit"
          isDisabled={isBusy}
          aria-busy={isBusy}
          className="w-full h-11 mt-1 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-sm leading-none transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {isBusy ? (
            <>
              <Loader2 size={16} aria-hidden="true" className="animate-spin" />
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

export default function SignUpPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <SignUpForm />
    </Suspense>
  );
}
