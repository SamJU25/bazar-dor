"use client";

import { useReducer } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { AuthErrorAlert } from "@/components/AuthFormShell";
import { signIn } from "@/lib/auth-client";
import {
  type OAuthProvider,
  socialAuthReducer,
} from "@/lib/state-machines";

interface SocialAuthButtonsProps {
  callbackURL?: string;
}

export default function SocialAuthButtons({
  callbackURL = "/",
}: SocialAuthButtonsProps) {
  const [authState, dispatch] = useReducer(socialAuthReducer, {
    status: "idle",
  });

  const handleSocialLogin = async (provider: OAuthProvider) => {
    if (authState.status === "redirecting") return;
    dispatch({ type: "START", provider });
    try {
      const { error } = await signIn.social({
        provider,
        callbackURL,
        errorCallbackURL: "/signin",
      });
      if (error) {
        const message =
          error.code === "PROVIDER_NOT_FOUND"
            ? "এই সোশ্যাল লগইন প্রোভাইডারটি এখনও কনফিগার করা হয়নি"
            : error.message || "সোশ্যাল লগইন করা যায়নি";
        dispatch({ type: "FAIL", provider, message });
        toast.error(message);
      }
    } catch {
      const message = "সোশ্যাল লগইন চালু করতে সমস্যা হয়েছে";
      dispatch({ type: "FAIL", provider, message });
      toast.error(message);
    }
  };

  const isRedirecting = authState.status === "redirecting";
  const activeProvider =
    authState.status === "redirecting" ? authState.provider : null;

  return (
    <div data-state={authState.status} className="flex flex-col gap-2.5">
      <Button
        type="button"
        variant="outline"
        isDisabled={isRedirecting}
        aria-busy={activeProvider === "google"}
        onPress={() => void handleSocialLogin("google")}
        className="btn-secondary w-full h-11 rounded-xl gap-2.5"
      >
        <svg className="w-4 h-4 mx-0 my-0 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.97Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
          />
        </svg>
        <span>
          {activeProvider === "google"
            ? "Google এ যাচ্ছে..."
            : "Google দিয়ে চালিয়ে যান"}
        </span>
      </Button>

      <Button
        type="button"
        variant="outline"
        isDisabled={isRedirecting}
        aria-busy={activeProvider === "facebook"}
        onPress={() => void handleSocialLogin("facebook")}
        className="btn-secondary w-full h-11 rounded-xl gap-2.5"
      >
        <svg className="w-4 h-4 mx-0 my-0 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#1877F2"
            d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"
          />
        </svg>
        <span>
          {activeProvider === "facebook"
            ? "Facebook এ যাচ্ছে..."
            : "Facebook দিয়ে চালিয়ে যান"}
        </span>
      </Button>

      {authState.status === "error" ? (
        <AuthErrorAlert message={authState.message} compact />
      ) : null}
    </div>
  );
}
