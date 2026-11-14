function normalizeSiteUrl(raw: string | undefined): string | undefined {
  const trimmed = raw?.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  const candidate =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.origin;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/** Resolves the canonical public origin for metadata, sitemaps, and robots rules. */
export function getSiteUrl(): URL {
  const resolved =
    normalizeSiteUrl(process.env.NEXT_PUBLIC_BETTER_AUTH_URL) ||
    normalizeSiteUrl(process.env.BETTER_AUTH_URL) ||
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeSiteUrl(process.env.VERCEL_URL) ||
    "https://bazar-dor.vercel.app";
  return new URL(resolved);
}
