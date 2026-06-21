import type { MetadataRoute } from "next";
import { company, verticals, articles, legalPages } from "../constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.url;
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/recursos`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...verticals.map((v) => ({
      url: `${base}/soluciones/${v.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${base}/recursos/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...legalPages.map((p) => ({
      url: `${base}/legales/${p.slug}`,
      lastModified: new Date(p.updated),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
