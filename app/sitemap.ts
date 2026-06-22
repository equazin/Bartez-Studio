import type { MetadataRoute } from "next";
import { company, verticals, legalPages } from "../constants";
import { getDynamicArticles, getDynamicSuccessCases } from "../lib/db-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = company.url;
  const now = new Date();
  const [articles, cases] = await Promise.all([getDynamicArticles(), getDynamicSuccessCases()]);
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/quienes-somos`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/revendedores`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/marcas`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/empresas`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/gobierno`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/educacion`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/garantias-rma`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/configurador`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/rfq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/descargas`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/recursos`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...verticals.map((item) => ({
      url: `${base}/soluciones/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${base}/recursos/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...cases.map((item) => ({
      url: `${base}/casos/${item.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...legalPages.map((page) => ({
      url: `${base}/legales/${page.slug}`,
      lastModified: new Date(page.updated),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
