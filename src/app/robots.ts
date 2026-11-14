import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/category/", "/privacy"],
        disallow: ["/api/", "/signin", "/signup", "/profile", "/product/"],
      },
    ],
    sitemap: `${siteUrl.origin}/sitemap.xml`,
  };
}
