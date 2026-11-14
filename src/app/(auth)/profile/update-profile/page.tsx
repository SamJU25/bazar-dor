"use client";

import React, { useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { ArrowLeft, Check, Loader2, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import {
  AUTH_INPUT_CLASS,
  AuthErrorAlert,
  AuthRequiredNotice,
} from "@/components/AuthFormShell";
import { updateUser, useSession } from "@/lib/auth-client";
import {
  asyncActionReducer,
  isActionBusy,
  resolveSessionGateState,
} from "@/lib/state-machines";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const gate = resolveSessionGateState(isPending, session?.user);
  const [name, setName] = useState("");
  const hasEditedRef = useRef(false);
  const [submitState, dispatch] = useReducer(asyncActionReducer, {
    status: "idle",
  });

  useEffect(() => {
    if (
      gate.status === "authenticated" &&
      gate.user.name &&
      !hasEditedRef.current
    ) {
      setName(gate.user.name);
    }
  }, [gate]);

  const savedName =
    gate.status === "authenticated" ? (gate.user.name ?? "").trim() : "";
  const trimmedName = name.trim();
  const isDirty = trimmedName !== savedName;
  const isBusy = isActionBusy(submitState);

  const handleNameChange = (nextValue: string) => {
    hasEditedRef.current = true;
    if (submitState.status === "error") {
      dispatch({ type: "RESET" });
    }
    setName(nextValue);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBusy) return;

    if (!trimmedName) {
      const message = "অনুগ্রহ করে আপনার নাম লিখুন";
      dispatch({ type: "FAIL", message });
      toast.error(message);
      return;
    }

    if (!isDirty) {
      return;
    }

    dispatch({ type: "SUBMIT" });
    try {
      const { data, error } = await updateUser({
        name: trimmedName,
      });

      if (error) {
        const message = error.message || "তথ্য আপডেট করা যায়নি";
        dispatch({ type: "FAIL", message });
        toast.error(message);
        return;
      }

      if (data) {
        dispatch({ type: "SUCCEED" });
        toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
        router.push("/profile");
        router.refresh();
      } else {
        dispatch({ type: "RESET" });
      }
    } catch {
      const message = "তথ্য আপডেট করার সময় সমস্যা হয়েছে";
      dispatch({ type: "FAIL", message });
      toast.error(message);
    }
  };

  if (gate.status === "loading") {
    return (
      <div
        data-state={gate.status}
        aria-busy="true"
        className="min-h-[60vh] flex items-center justify-center"
      >
        <Loader2 size={28} aria-hidden="true" className="animate-spin text-[#15803d]" />
      </div>
    );
  }

  if (gate.status === "unauthenticated") {
    return (
      <AuthRequiredNotice
        state={gate.status}
        signInHref="/signin?reason=auth_required&callbackUrl=%2Fprofile%2Fupdate-profile"
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] w-full flex flex-col items-center justify-center bg-[#f8faf8] px-4 py-10">
      <div className="w-full max-w-[440px] space-y-5">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#15803d] transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>প্রোফাইলে ফিরে যান</span>
        </Link>

        <Card className="bg-white rounded-2xl border border-[#dce6dc] shadow-none gap-0 p-6 sm:p-8">
          <Card.Header className="p-0 pb-4 flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-[#162218]">
              তথ্য পরিবর্তন
            </h1>
          </Card.Header>

          <Card.Content className="p-0">
            <Form
              data-state={submitState.status}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <TextField
                name="name"
                value={name}
                onChange={handleNameChange}
                isRequired
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className="text-xs sm:text-sm font-semibold text-slate-700">
                  নতুন নাম
                </Label>
                <div className="relative flex items-center">
                  <UserIcon
                    size={17}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 text-slate-500"
                  />
                  <Input
                    placeholder="আপনার নাম লিখুন"
                    autoComplete="name"
                    className={AUTH_INPUT_CLASS}
                  />
                </div>
                <FieldError className="text-xs text-red-700" />
              </TextField>

              <AuthErrorAlert
                message={submitState.status === "error" ? submitState.message : null}
              />

              <Button
                type="submit"
                isDisabled={isBusy || !trimmedName || !isDirty}
                aria-busy={isBusy}
                className="btn-primary w-full h-11 mt-1 rounded-xl"
              >
                {isBusy ? (
                  <>
                    <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                    <span>আপডেট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} aria-hidden="true" />
                    <span>তথ্য আপডেট করুন</span>
                  </>
                )}
              </Button>
            </Form>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
