import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "বাজার দর — প্রতিদিনের নিত্যপণ্যের বাজারদর",
    short_name: "বাজার দর",
    description:
      "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর, দামের পরিবর্তন এবং বাজারভিত্তিক তুলনা।",
    start_url: "/",
    display: "standalone",
    background_color: "#f8faf8",
    theme_color: "#15803d",
    lang: "bn",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
