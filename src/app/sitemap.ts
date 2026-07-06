import type { MetadataRoute } from "next";
import { projects, navItems } from "@/lib/portfolio-data";

const SITE_URL = "https://shubhjain.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const sections = navItems.map((item) => ({
    url: `${SITE_URL}/#${item.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: item.id === "home" ? 1 : 0.8,
  }));

  // Each project gets its own anchor for deep-linking.
  const projectEntries = projects.map((p) => ({
    url: `${SITE_URL}/#projects`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...sections,
    ...projectEntries,
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
