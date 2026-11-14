import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/api";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl().origin;
  const categories = await getCategories();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/category/${encodeURIComponent(category.slug)}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes];
}
