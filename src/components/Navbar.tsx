"use client";

import { useEffect, useReducer } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Dropdown, Separator } from "@heroui/react";
import { Calendar, LogOut, Settings, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import BrandLogo from "@/components/BrandLogo";
import { signOut, useSession } from "@/lib/auth-client";
import { getUserInitials } from "@/lib/auth-helpers";
import { formatDhakaDateBn } from "@/lib/format";
import {
  asyncActionReducer,
  isActionBusy,
  resolveSessionGateState,
} from "@/lib/state-machines";
import { ICategory } from "@/types/bazar";

function getNavLinkClass(isActive: boolean): string {
  return `group relative inline-flex items-center h-10 xl:h-full px-0.5 text-xs sm:text-sm leading-snug whitespace-nowrap focus-visible:outline-none transition-colors shrink-0 ${
    isActive
      ? "text-[#15803d] font-semibold after:content-[''] after:absolute after:inset-x-1.5 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#15803d]"
      : "text-slate-700 hover:text-[#15803d] font-medium"
  }`;
}

const NAV_LABEL_CLASS =
  "px-2.5 py-1.5 rounded-lg transition-colors group-hover:bg-[#f3fbf4] group-focus-visible:ring-2 group-focus-visible:ring-[#15803d]/45";

interface NavbarProps {
  categories: ICategory[];
  initialDate?: string;
}

export default function Navbar({ categories, initialDate }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [signOutState, dispatchSignOut] = useReducer(asyncActionReducer, {
    status: "idle",
  });

  const authGate = resolveSessionGateState(isPending, session?.user);

  useEffect(() => {
    if (authGate.status === "unauthenticated" && signOutState.status !== "idle") {
      dispatchSignOut({ type: "RESET" });
    }
  }, [authGate.status, signOutState.status]);

  const formattedDate = initialDate ?? formatDhakaDateBn();

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
    <header className="w-full bg-white border-b border-[#dce6dc] sticky top-0 z-50">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-wrap xl:flex-nowrap items-center xl:items-stretch justify-between gap-x-2.5 sm:gap-x-3 xl:gap-x-5">
          <div className="order-1 flex-1 xl:flex-initial flex flex-col justify-center gap-1 min-w-0 py-2.5 sm:py-3 xl:py-2.5">
            <Link href="/" className="flex items-center gap-2 w-fit group">
              <BrandLogo className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="text-xl sm:text-2xl font-bold text-[#15803d] tracking-tight leading-none">
                বাজার দর
              </span>
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium leading-none truncate">
              <Calendar
                size={12}
                aria-hidden="true"
                className="text-slate-500 shrink-0"
              />
              <span>{formattedDate}</span>
            </div>
          </div>

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
                  className="flex items-center gap-2 sm:gap-2.5 h-10 pl-1.5 pr-3 rounded-full border border-[#7f9484] bg-[#f3fbf4] hover:border-[#15803d] active:bg-[#e5f5e8] focus:outline-none focus-visible:outline-none data-[focus-visible=true]:outline-none data-[focus-visible=true]:border-[#15803d] data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-[#15803d]/20 data-[open=true]:border-[#15803d] data-[open=true]:ring-2 data-[open=true]:ring-[#15803d]/20 transition-[background-color,border-color,box-shadow] cursor-pointer disabled:opacity-60"
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
                      if (key === "update")
                        router.push("/profile/update-profile");
                      if (key === "signout") void handleSignOut();
                    }}
                  >
                    <Dropdown.Item id="profile" textValue="আমার প্রোফাইল">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <UserIcon size={15} aria-hidden="true" />
                        <span>আমার প্রোফাইল</span>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item id="update" textValue="তথ্য আপডেট">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Settings size={15} aria-hidden="true" />
                        <span>তথ্য আপডেট</span>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="signout"
                      textValue="সাইন আউট"
                      variant="danger"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
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

          <Separator className="order-3 w-full bg-[#e5ece5] xl:hidden" />

          <nav
            aria-label="পণ্যের বিভাগসমূহ"
            className="order-4 xl:order-2 -mx-4 px-4 sm:mx-0 sm:px-0 w-[calc(100%+2rem)] sm:w-full xl:w-auto xl:flex-1 xl:min-w-0 xl:self-stretch flex items-center xl:justify-center gap-0.5 sm:gap-1 pt-1 pb-0 xl:py-0 overflow-x-auto no-scrollbar"
          >
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={getNavLinkClass(pathname === "/")}
            >
              <span className={NAV_LABEL_CLASS}>সব পণ্য</span>
            </Link>

            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={getNavLinkClass(isActive)}
                >
                  <span className={NAV_LABEL_CLASS}>{cat.nameBn}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
