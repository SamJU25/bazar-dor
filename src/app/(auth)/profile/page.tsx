import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import { getCachedServerSession } from "@/lib/auth";
import { buildAuthUrl } from "@/lib/auth-helpers";

export const metadata: Metadata = {
  title: "আমার প্রোফাইল",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await getCachedServerSession();
  if (!session?.user) {
    redirect(buildAuthUrl("/signin", "/profile", "auth_required"));
  }

  return <ProfileCard user={session.user} />;
}
