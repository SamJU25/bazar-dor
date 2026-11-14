import { cache } from "react";
import {
  getCategories,
  getCategoryPageData,
  getProductBySlugOrIdStrict,
  getProducts,
} from "@/lib/api";

export const getCachedCategories = cache(async () => getCategories());

export const getCachedProducts = cache(async (category?: string) =>
  getProducts(category),
);

export const getCachedCategoryPageData = cache(async (slug: string) =>
  getCategoryPageData(slug),
);

export const getCachedProductDetailsStrict = cache(async (slugOrId: string) =>
  getProductBySlugOrIdStrict(slugOrId),
);
