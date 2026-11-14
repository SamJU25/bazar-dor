import type { Metadata } from "next";
import { redirect } from "next/navigation";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { getCachedServerSession } from "@/lib/auth";
import { buildAuthUrl } from "@/lib/auth-helpers";

export const metadata: Metadata = {
  title: "তথ্য আপডেট",
  robots: { index: false, follow: false },
};

export default async function UpdateProfilePage() {
  const session = await getCachedServerSession();
  if (!session?.user) {
    redirect(
      buildAuthUrl("/signin", "/profile/update-profile", "auth_required"),
    );
  }

  return <UpdateProfileForm initialName={session.user.name ?? ""} />;
}
