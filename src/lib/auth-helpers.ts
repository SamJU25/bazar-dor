export interface AuthEnv {
  BETTER_AUTH_URL?: string;
  NEXT_PUBLIC_BETTER_AUTH_URL?: string;
  VERCEL_URL?: string;
  VERCEL_BRANCH_URL?: string;
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

const CONTROL_CHAR_REGEX = /[\u0000-\u001f\u007f-\u009f]/;

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
    trimmed.includes("\\") ||
    CONTROL_CHAR_REGEX.test(trimmed)
  ) {
    return fallback;
  }

  try {
    const decoded = decodeURIComponent(trimmed);
    if (
      decoded.startsWith("//") ||
      decoded.includes("\\") ||
      CONTROL_CHAR_REGEX.test(decoded)
    ) {
      return fallback;
    }
  } catch {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed, "https://app.invalid");
    if (parsed.origin !== "https://app.invalid") {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
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
    normalizeOrigin(env.VERCEL_BRANCH_URL),
    normalizeOrigin(env.VERCEL_URL),
  ].filter((origin): origin is string => Boolean(origin));

  return Array.from(new Set(candidates));
}

const SAFE_ERROR_CODE_REGEX = /^[a-z0-9_.-]{1,40}$/i;

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "সোশ্যাল লগইন বাতিল করা হয়েছে বা অনুমতি দেওয়া হয়নি (access_denied)",
  state_mismatch: "সেশন যাচাই মেলেনি — আবার চেষ্টা করুন (state_mismatch)",
  state_not_found: "লগইন সেশনের মেয়াদ শেষ হয়েছে — আবার চেষ্টা করুন (state_not_found)",
  invalid_code: "OAuth কোড বা ক্লায়েন্ট সেক্রেট মেলেনি (invalid_code)",
  invalid_client: "সোশ্যাল লগইন প্রোভাইডার সেক্রেট বা ক্লায়েন্ট আইডি সঠিক নয় (invalid_client)",
  unable_to_create_user: "ডেটাবেসে অ্যাকাউন্ট সংরক্ষণ করা যায়নি (unable_to_create_user)",
  unable_to_get_user_info: "প্রোভাইডার থেকে প্রোফাইল তথ্য পাওয়া যায়নি (unable_to_get_user_info)",
  email_not_found: "এই অ্যাকাউন্ট থেকে ইমেইল পাওয়া যায়নি (email_not_found)",
  oauth_provider_not_found: "এই সোশ্যাল লগইন প্রোভাইডারটি কনফিগার করা হয়নি",
  signup_disabled: "এই প্রোভাইডার দিয়ে নতুন নিবন্ধন সাময়িকভাবে বন্ধ আছে (signup_disabled)",
};

/** Converts BetterAuth OAuth redirect error query codes into safe user-visible messages. */
export function formatOAuthErrorMessage(
  errorCode: string | null | undefined,
): string | null {
  const normalized = errorCode?.trim();
  if (!normalized) return null;
  const known = OAUTH_ERROR_MESSAGES[normalized];
  if (known) return known;
  if (SAFE_ERROR_CODE_REGEX.test(normalized)) {
    return `সোশ্যাল লগইন সম্পন্ন করা যায়নি (${normalized})`;
  }
  return "সোশ্যাল লগইন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।";
}

const AUTH_ACTION_ERROR_PATTERNS: Array<[RegExp, string]> = [
  [/invalid email or password|invalid credentials/i, "ইমেইল বা পাসওয়ার্ড সঠিক নয়"],
  [/user already exists|already registered|email.*exists/i, "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট তৈরি করা হয়েছে"],
  [/password.*too short/i, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"],
  [/password.*too long/i, "পাসওয়ার্ড সর্বোচ্চ ১২৮ অক্ষরের মধ্যে হতে হবে"],
  [/invalid email/i, "সঠিক ইমেইল ঠিকানা দিন"],
  [/too many requests|rate limit/i, "অনেকবার চেষ্টা করা হয়েছে — কিছুক্ষণ পর আবার চেষ্টা করুন"],
  [/session expired|unauthorized/i, "আপনার সেশনের মেয়াদ শেষ হয়েছে — আবার লগইন করুন"],
  [/failed to fetch|network/i, "নেটওয়ার্ক সংযোগ ব্যর্থ হয়েছে — আবার চেষ্টা করুন"],
];

/** Normalizes BetterAuth client error strings/codes into concise Bangla feedback. */
export function formatAuthActionError(
  rawMessage: string | null | undefined,
  fallback: string,
): string {
  const trimmed = rawMessage?.trim();
  if (!trimmed) return fallback;
  for (const [pattern, localized] of AUTH_ACTION_ERROR_PATTERNS) {
    if (pattern.test(trimmed)) {
      return localized;
    }
  }
  if (/[\u0980-\u09FF]/.test(trimmed)) {
    return trimmed;
  }
  return fallback;
}
