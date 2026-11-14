"use client";

import { useEffect, useReducer } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Dropdown } from "@heroui/react";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { signOut, useSession } from "@/lib/auth-client";
import { getUserInitials } from "@/lib/auth-helpers";
import {
  asyncActionReducer,
  isActionBusy,
  resolveSessionGateState,
} from "@/lib/state-machines";

export default function NavbarAuthMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [signOutState, dispatchSignOut] = useReducer(asyncActionReducer, {
    status: "idle",
  });

  const authGate = resolveSessionGateState(isPending, session?.user);

  useEffect(() => {
    if (
      authGate.status === "unauthenticated" &&
      signOutState.status !== "idle"
    ) {
      dispatchSignOut({ type: "RESET" });
    }
  }, [authGate.status, signOutState.status]);

  const handleSignOut = async () => {
    if (isActionBusy(signOutState)) return;
    dispatchSignOut({ type: "SUBMIT" });
    try {
      const { error } = await signOut();
      if (error) {
        const message = error.message || "সাইন আউট করতে সমস্যা হয়েছে";
        dispatchSignOut({ type: "FAIL", message });
        toast.error(message);
        return;
      }
      dispatchSignOut({ type: "SUCCEED" });
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      if (pathname.startsWith("/product") || pathname.startsWith("/profile")) {
        router.push("/");
      }
      router.refresh();
    } catch {
      const message = "সাইন আউট করতে সমস্যা হয়েছে";
      dispatchSignOut({ type: "FAIL", message });
      toast.error(message);
    }
  };

  const isSigningOut = isActionBusy(signOutState);
  const authMachineState = isSigningOut ? "signing-out" : authGate.status;
  const user = authGate.status === "authenticated" ? authGate.user : null;
  const userInitials = getUserInitials(user?.name);

  return (
    <div
      data-auth-state={authMachineState}
      className="order-2 xl:order-3 flex items-center gap-2 sm:gap-2.5 shrink-0 py-2.5 sm:py-3 xl:py-2.5"
    >
      {authGate.status === "loading" ? (
        <div
          role="status"
          aria-busy="true"
          aria-label="ব্যবহারকারীর তথ্য লোড হচ্ছে"
          className="h-10 w-28 rounded-xl bg-slate-100 animate-pulse motion-reduce:animate-none"
        />
      ) : user ? (
        <Dropdown>
          <Dropdown.Trigger
            isDisabled={isSigningOut}
            aria-busy={isSigningOut}
            aria-label="ব্যবহারকারীর মেনু"
            className="flex items-center gap-2 sm:gap-2.5 h-10 pl-1.5 pr-3 rounded-full border border-[#7f9484] bg-[#f3fbf4] hover:border-[#15803d] active:bg-[#e5f5e8] focus:outline-none focus-visible:outline-none data-[focus-visible=true]:outline-none data-[focus-visible=true]:border-[#15803d] data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-[#15803d] data-[open=true]:border-[#15803d] data-[open=true]:ring-2 data-[open=true]:ring-[#15803d]/30 transition-[background-color,border-color,box-shadow] cursor-pointer disabled:opacity-60"
          >
            <Avatar size="sm">
              {user.image ? (
                <Avatar.Image
                  alt={user.name || "ব্যবহারকারী"}
                  src={user.image}
                />
              ) : null}
              <Avatar.Fallback className="bg-[#15803d] text-white text-xs font-semibold">
                {userInitials}
              </Avatar.Fallback>
            </Avatar>
            <span className="text-xs sm:text-sm font-semibold text-[#162218] max-w-28 sm:max-w-40 truncate">
              {user.name || user.email}
            </span>
          </Dropdown.Trigger>

          <Dropdown.Popover>
            <Dropdown.Menu
              aria-label="প্রোফাইল মেনু"
              onAction={(key) => {
                if (key === "profile") router.push("/profile");
                if (key === "update") router.push("/profile/update-profile");
                if (key === "signout") void handleSignOut();
              }}
            >
              <Dropdown.Item id="profile" textValue="আমার প্রোফাইল">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <UserIcon size={15} aria-hidden="true" />
                  <span>আমার প্রোফাইল</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item id="update" textValue="তথ্য আপডেট">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Settings size={15} aria-hidden="true" />
                  <span>তথ্য আপডেট</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                id="signout"
                textValue="সাইন আউট"
                variant="danger"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-[#b91c1c]">
                  <LogOut size={15} aria-hidden="true" />
                  <span>
                    {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                  </span>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/signin"
            className="btn-secondary h-10 sm:h-9 px-3.5 sm:px-4 rounded-lg text-xs sm:text-sm"
          >
            সাইন ইন
          </Link>
          <Link
            href="/signup"
            className="btn-primary h-10 sm:h-9 px-3.5 sm:px-4 rounded-lg text-xs sm:text-sm"
          >
            সাইন আপ
          </Link>
        </div>
      )}
    </div>
  );
}
