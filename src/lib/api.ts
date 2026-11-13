import type { ICategory, IProduct } from "@/types/bazar";

const PRIMARY_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://openapi.programming-hero.com/api/bazardor";
const FALLBACK_API_URL = "https://api.api-store.workers.dev/api/bazardor";

async function fetchWithFallback<T>(
  path: string,
  revalidateSeconds = 60,
): Promise<T> {
  const urls = [
    `${PRIMARY_API_URL}${path}`,
    `${FALLBACK_API_URL}${path}`,
  ];

  let lastError: unknown;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: revalidateSeconds },
      });
      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status} from ${url}`);
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

  throw lastError ?? new Error(`Failed to fetch ${path}`);
}

export async function getCategories(): Promise<ICategory[]> {
  try {
    const data = await fetchWithFallback<ICategory[]>("/categories", 300);
    return Array.isArray(data) ? data : [];
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

export async function getProducts(category?: string): Promise<IProduct[]> {
  try {
    const query = category
      ? `/products?category=${encodeURIComponent(category)}`
      : "/products";
    const data = await fetchWithFallback<IProduct[]>(query, 60);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
}

export async function getProductBySlugOrId(
  slugOrId: string,
): Promise<IProduct | null> {
  const products = await getProducts();
  const matched = products.find(
    (p) => p.slug === slugOrId || String(p.id) === slugOrId,
  );
  if (matched) return matched;

  if (/^\d+$/.test(slugOrId)) {
    try {
      return await fetchWithFallback<IProduct>(`/products/${slugOrId}`, 60);
    } catch {
      return null;
    }
  }

  return null;
}
