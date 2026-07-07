import type { MetadataRoute } from "next";
import { navItems } from "@/lib/portfolio-data";

export const dynamic = "force-static";

const SITE_URL = "https://infoshubhjain.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const sections = navItems
    .filter((item) => item.id !== "home")
    .map((item) => ({
      url: `${SITE_URL}/#${item.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...sections,
  ];
}
