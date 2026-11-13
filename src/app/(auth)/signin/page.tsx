"use client";

import React, { Suspense, useEffect, useReducer, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import {
  AUTH_INPUT_CLASS,
  AuthErrorAlert,
  AuthPageShell,
  AuthPasswordField,
  AuthSuspenseFallback,
} from "@/components/AuthFormShell";
import { signIn } from "@/lib/auth-client";
import {
  buildAuthUrl,
  formatOAuthErrorMessage,
  getSafeCallbackUrl,
} from "@/lib/auth-helpers";
import { asyncActionReducer, isActionBusy } from "@/lib/state-machines";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const reason = searchParams.get("reason");
  const oauthErrorMessage = formatOAuthErrorMessage(searchParams.get("error"));
  const [oauthErrorDismissed, setOauthErrorDismissed] = useState(false);
  const toastedRef = useRef(false);

  const [submitState, dispatch] = useReducer(asyncActionReducer, {
    status: "idle",
  });
  const isBusy = isActionBusy(submitState);
  const activeAlertMessage =
    submitState.status === "error"
      ? submitState.message
      : oauthErrorDismissed
        ? null
        : oauthErrorMessage;

  useEffect(() => {
    if (toastedRef.current) return;
    if (oauthErrorMessage) {
      toastedRef.current = true;
      toast.error(oauthErrorMessage);
      return;
    }
    if (reason === "auth_required") {
      toastedRef.current = true;
      toast("বিস্তারিত দেখতে অনুগ্রহ করে সাইন ইন করুন", { icon: "🔒" });
    }
  }, [oauthErrorMessage, reason]);

  const clearErrorOnEdit = () => {
    if (!oauthErrorDismissed && oauthErrorMessage) {
      setOauthErrorDismissed(true);
    }
    if (submitState.status === "error") {
      dispatch({ type: "RESET" });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBusy) return;
    if (!oauthErrorDismissed && oauthErrorMessage) {
      setOauthErrorDismissed(true);
    }

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      const message = "ইমেইল এবং পাসওয়ার্ড দিন";
      dispatch({ type: "FAIL", message });
      toast.error(message);
      return;
    }

    dispatch({ type: "SUBMIT" });
    try {
      const { error } = await signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });

      if (error) {
        const message = error.message || "সাইন ইন ব্যর্থ হয়েছে";
        dispatch({ type: "FAIL", message });
        toast.error(message);
        return;
      }

      dispatch({ type: "SUCCEED" });
      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      const message = "সাইন ইন করার সময় সমস্যা হয়েছে";
      dispatch({ type: "FAIL", message });
      toast.error(message);
    }
  };

  return (
    <AuthPageShell
      title="সাইন ইন"
      callbackUrl={callbackUrl}
      footerPrompt="অ্যাকাউন্ট নেই?"
      footerLinkLabel="সাইন আপ করুন"
      footerLinkHref={buildAuthUrl("/signup", callbackUrl)}
    >
      <Form
        data-state={submitState.status}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
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
          placeholder="••••••••"
          autoComplete="current-password"
          onChange={clearErrorOnEdit}
        />

        <AuthErrorAlert message={activeAlertMessage} />

        <Button
          type="submit"
          isDisabled={isBusy}
          aria-busy={isBusy}
          className="w-full h-11 mt-1 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-sm leading-none transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {isBusy ? (
            <>
              <Loader2 size={16} aria-hidden="true" className="animate-spin" />
              <span>অপেক্ষা করুন...</span>
            </>
          ) : (
            <span>সাইন ইন</span>
          )}
        </Button>
      </Form>
    </AuthPageShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <SignInForm />
    </Suspense>
  );
}
