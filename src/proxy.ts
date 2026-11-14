import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { buildAuthUrl } from "@/lib/auth-helpers";

/** Edge-fast cookie presence gate; protected pages re-verify session against MongoDB. */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const callbackTarget = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    const signInPath = buildAuthUrl(
      "/signin",
      callbackTarget,
      "auth_required",
    );
    const parsedSignIn = new URL(signInPath, "https://app.invalid");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = parsedSignIn.pathname;
    redirectUrl.search = parsedSignIn.search;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/profile", "/profile/:path*"],
};
