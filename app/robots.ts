import type { MetadataRoute } from "next";
import { company } from "../constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/gracias" },
    sitemap: `${company.url}/sitemap.xml`,
  };
}
