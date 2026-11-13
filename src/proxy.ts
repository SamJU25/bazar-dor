import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { buildAuthUrl } from "@/lib/auth-helpers";

export async function proxy(request: NextRequest) {
  const session = await getServerSession(request.headers);

  if (!session) {
    const callbackTarget = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    const signInPath = buildAuthUrl(
      "/signin",
      callbackTarget,
      "auth_required",
    );
    return NextResponse.redirect(new URL(signInPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/profile", "/profile/:path*"],
};
