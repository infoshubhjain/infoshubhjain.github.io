import type { MetadataRoute } from "next";
import { SECTIONS } from "@/lib/prototype-data";

export const dynamic = "force-static";

const SITE_URL = "https://infoshubhjain.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const sections = SECTIONS.map((section) => ({
    url: `${SITE_URL}/#${section.id}`,
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
