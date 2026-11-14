import type { ICategory, IProduct } from "@/types/bazar";

const DEFAULT_PRIMARY_API_URL =
  "https://openapi.programming-hero.com/api/bazardor";
const FALLBACK_API_URL = "https://api.api-store.workers.dev/api/bazardor";
const UPSTREAM_TIMEOUT_MS = 4500;

function resolvePrimaryApiUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configured) return DEFAULT_PRIMARY_API_URL;
  try {
    const parsed = new URL(configured);
    const isLocalHttp =
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");
    if (parsed.protocol === "https:" || isLocalHttp) {
      return parsed.toString().replace(/\/+$/, "");
    }
  } catch {
    // Ignore malformed override and fall back to verified default API host.
  }
  return DEFAULT_PRIMARY_API_URL;
}

const PRIMARY_API_URL = resolvePrimaryApiUrl();

/** Thrown when primary and fallback price APIs both fail or time out. */
export class CatalogUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogUnavailableError";
  }
}

class UpstreamHttpError extends Error {
  status: number;
  constructor(status: number, url: string) {
    super(`HTTP ${status} from ${url}`);
    this.status = status;
  }
}

function isValidCategory(value: unknown): value is ICategory {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.slug === "string" &&
    typeof record.nameBn === "string" &&
    typeof record.icon === "string"
  );
}

function isValidProduct(value: unknown): value is IProduct {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const change = record.change as Record<string, unknown> | undefined;
  return (
    typeof record.id === "number" &&
    typeof record.slug === "string" &&
    typeof record.nameBn === "string" &&
    typeof record.category === "string" &&
    typeof record.categoryNameBn === "string" &&
    typeof record.today === "number" &&
    Number.isFinite(record.today) &&
    Boolean(change) &&
    (change?.dir === "up" || change?.dir === "down" || change?.dir === "flat") &&
    typeof change?.pct === "number"
  );
}

async function fetchWithFallback<T>(
  path: string,
  revalidateSeconds = 60,
): Promise<T> {
  const urls = [`${PRIMARY_API_URL}${path}`, `${FALLBACK_API_URL}${path}`];

  let lastError: unknown;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: revalidateSeconds },
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
      if (!res.ok) {
        lastError = new UpstreamHttpError(res.status, url);
        continue;
      }
      const data = await res.json();
      if (data && typeof data === "object" && "error" in data) {
        lastError = new Error(String(data.error));
        continue;
      }
      return data as T;
    } catch (error) {
      lastError = error;
    }
  }

  const detail =
    lastError instanceof Error ? lastError.message : `Failed to fetch ${path}`;
  throw new CatalogUnavailableError(detail);
}

export async function getCategoriesStrict(): Promise<ICategory[]> {
  const data = await fetchWithFallback<unknown>("/categories", 300);
  if (!Array.isArray(data)) {
    throw new CatalogUnavailableError("Invalid categories payload shape");
  }
  return data.filter(isValidCategory);
}

export async function getCategories(): Promise<ICategory[]> {
  try {
    return await getCategoriesStrict();
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<ICategory | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug || c.id === slug) ?? null;
}

export async function getProductsStrict(
  category?: string,
): Promise<IProduct[]> {
  const query = category
    ? `/products?category=${encodeURIComponent(category)}`
    : "/products";
  const data = await fetchWithFallback<unknown>(query, 60);
  if (!Array.isArray(data)) {
    throw new CatalogUnavailableError("Invalid products payload shape");
  }
  return data.filter(isValidProduct);
}

export async function getProducts(category?: string): Promise<IProduct[]> {
  try {
    return await getProductsStrict(category);
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
}

export async function getCategoryPageData(slug: string): Promise<{
  category: ICategory | null;
  categories: ICategory[];
  products: IProduct[];
}> {
  const categories = await getCategoriesStrict();
  const category =
    categories.find((c) => c.slug === slug || c.id === slug) ?? null;
  if (!category) {
    return { category: null, categories, products: [] };
  }
  const products = await getProductsStrict(category.slug);
  return { category, categories, products };
}

export async function getProductBySlugOrIdStrict(
  slugOrId: string,
): Promise<IProduct | null> {
  const products = await getProductsStrict();
  const matched = products.find(
    (p) => p.slug === slugOrId || String(p.id) === slugOrId,
  );
  if (matched) return matched;

  if (/^\d+$/.test(slugOrId)) {
    try {
      const single = await fetchWithFallback<unknown>(
        `/products/${slugOrId}`,
        60,
      );
      return isValidProduct(single) ? single : null;
    } catch (error) {
      if (error instanceof CatalogUnavailableError) {
        return null;
      }
      throw error;
    }
  }

  return null;
}

export async function getProductBySlugOrId(
  slugOrId: string,
): Promise<IProduct | null> {
  try {
    return await getProductBySlugOrIdStrict(slugOrId);
  } catch (error) {
    console.error("Failed to load product:", error);
    return null;
  }
}
