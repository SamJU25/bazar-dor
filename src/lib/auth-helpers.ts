export interface AuthEnv {
  BETTER_AUTH_URL?: string;
  NEXT_PUBLIC_BETTER_AUTH_URL?: string;
  VERCEL_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
}

function normalizeOrigin(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/** Ensures redirect targets stay within this application to prevent open redirects. */
export function getSafeCallbackUrl(
  raw: string | null | undefined,
  fallback = "/",
): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (
    !trimmed ||
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\")
  ) {
    return fallback;
  }
  return trimmed;
}

/** Builds `/signin` or `/signup` URLs while preserving safe redirect context. */
export function buildAuthUrl(
  pathname: "/signin" | "/signup",
  callbackUrl: string,
  reason?: string,
): string {
  const safeCallback = getSafeCallbackUrl(callbackUrl);
  const params = new URLSearchParams();
  if (reason) {
    params.set("reason", reason);
  }
  if (safeCallback !== "/") {
    params.set("callbackUrl", safeCallback);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/** Extracts up to two display initials from a user's name for avatar fallbacks. */
export function getUserInitials(name?: string | null): string {
  if (!name) return "BD";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "BD";
  return parts
    .map((part) => Array.from(part)[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Resolves the canonical BetterAuth base URL across local and Vercel environments. */
export function resolveBaseUrl(env: AuthEnv): string | undefined {
  return (
    normalizeOrigin(env.BETTER_AUTH_URL) ||
    normalizeOrigin(env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeOrigin(env.VERCEL_URL)
  );
}

/** Builds a deduplicated list of trusted origins for BetterAuth CSRF/callback checks. */
export function resolveTrustedOrigins(env: AuthEnv): string[] {
  const candidates = [
    normalizeOrigin(env.BETTER_AUTH_URL),
    normalizeOrigin(env.NEXT_PUBLIC_BETTER_AUTH_URL),
    normalizeOrigin(env.VERCEL_PROJECT_PRODUCTION_URL),
    normalizeOrigin(env.VERCEL_URL),
  ].filter((origin): origin is string => Boolean(origin));

  return Array.from(new Set(candidates));
}

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "সোশ্যাল লগইন বাতিল করা হয়েছে বা অনুমতি দেওয়া হয়নি (access_denied)",
  state_mismatch: "সেশন যাচাই মেলেনি — আবার চেষ্টা করুন (state_mismatch)",
  invalid_code: "OAuth কোড বা ক্লায়েন্ট সেক্রেট মেলেনি (invalid_code)",
  unable_to_create_user: "ডেটাবেসে অ্যাকাউন্ট সংরক্ষণ করা যায়নি (unable_to_create_user)",
  unable_to_get_user_info: "প্রোভাইডার থেকে প্রোফাইল তথ্য পাওয়া যায়নি (unable_to_get_user_info)",
  email_not_found: "এই অ্যাকাউন্ট থেকে ইমেইল পাওয়া যায়নি (email_not_found)",
  oauth_provider_not_found: "এই সোশ্যাল লগইন প্রোভাইডারটি কনফিগার করা হয়নি",
};

/** Converts BetterAuth OAuth redirect error query codes into user-visible messages. */
export function formatOAuthErrorMessage(
  errorCode: string | null | undefined,
): string | null {
  const normalized = errorCode?.trim();
  if (!normalized) return null;
  return (
    OAUTH_ERROR_MESSAGES[normalized] ??
    `সোশ্যাল লগইন সম্পন্ন করা যায়নি (${normalized})`
  );
}
