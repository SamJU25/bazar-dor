"use client";

import React, { useEffect, useReducer, useState } from "react";
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
import { AUTH_INPUT_CLASS, AuthErrorAlert } from "@/components/AuthFormShell";
import { updateUser } from "@/lib/auth-client";
import { formatAuthActionError } from "@/lib/auth-helpers";
import { asyncActionReducer, isActionBusy } from "@/lib/state-machines";

interface UpdateProfileFormProps {
  initialName: string;
}

export default function UpdateProfileForm({
  initialName,
}: UpdateProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitState, dispatch] = useReducer(asyncActionReducer, {
    status: "idle",
  });

  useEffect(() => {
    const resetOnBfcache = (event: PageTransitionEvent) => {
      if (event.persisted) {
        dispatch({ type: "RESET" });
      }
    };
    window.addEventListener("pageshow", resetOnBfcache);
    return () => window.removeEventListener("pageshow", resetOnBfcache);
  }, []);

  const savedName = initialName.replace(/\s+/g, " ").trim();
  const normalizedName = name.replace(/\s+/g, " ").trim();
  const isDirty = normalizedName !== savedName;
  const isBusy = isActionBusy(submitState);

  const handleNameChange = (nextValue: string) => {
    if (fieldErrors.name) {
      setFieldErrors({});
    }
    if (submitState.status === "error") {
      dispatch({ type: "RESET" });
    }
    setName(nextValue);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBusy) return;

    if (normalizedName.length < 2) {
      const message = "নাম কমপক্ষে ২ অক্ষরের হতে হবে";
      setFieldErrors({ name: message });
      dispatch({ type: "FAIL", message });
      toast.error(message);
      return;
    }

    if (normalizedName.length > 80) {
      const message = "নাম সর্বোচ্চ ৮০ অক্ষরের মধ্যে হতে হবে";
      setFieldErrors({ name: message });
      dispatch({ type: "FAIL", message });
      toast.error(message);
      return;
    }

    if (!isDirty) {
      const message = "নতুন নাম আগের নামের চেয়ে আলাদা হতে হবে";
      setFieldErrors({ name: message });
      dispatch({ type: "FAIL", message });
      return;
    }

    setFieldErrors({});
    dispatch({ type: "SUBMIT" });
    try {
      const { data, error } = await updateUser({
        name: normalizedName,
      });

      if (error) {
        const message = formatAuthActionError(
          error.message || error.code,
          "তথ্য আপডেট করা যায়নি",
        );
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

  return (
    <div className="w-full flex flex-col items-center justify-center bg-[#f8faf8] px-4 py-8 sm:py-12">
      <div className="w-full max-w-[440px] space-y-5">
        <Link href="/profile" className="link-back text-xs sm:text-sm">
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
              validationBehavior="aria"
              validationErrors={fieldErrors}
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
                    maxLength={80}
                    className={AUTH_INPUT_CLASS}
                  />
                </div>
                <FieldError className="text-xs text-[#b91c1c]" />
              </TextField>

              <AuthErrorAlert
                message={
                  submitState.status === "error" ? submitState.message : null
                }
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
