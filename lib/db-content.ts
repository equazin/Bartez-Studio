import { prisma } from "./db";
import { partners as staticPartners, articles as staticArticles } from "../constants";

export type DynamicBrand = {
  name: string;
  logo: string;
};

export type DynamicArticle = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  metaDescription: string;
  readingTime: string;
  body: { p?: string; h?: string }[];
};

export async function getDynamicPartners(): Promise<DynamicBrand[]> {
  try {
    // Si no está configurada la base de datos, Prisma fallará al conectarse
    const clients = await prisma.clientLogo.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
    });
    
    if (clients.length > 0) {
      return clients.map(c => ({ name: c.name, logo: c.logoUrl }));
    }
  } catch (err) {
    // Falla de base de datos silenciosa (fallback a estático)
  }
  return staticPartners.brands;
}

export async function getDynamicArticles(): Promise<DynamicArticle[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });

    if (posts.length > 0) {
      return posts.map(p => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        cover: p.cover,
        metaDescription: p.metaDescription,
        readingTime: p.readingTime,
        body: p.body as any,
      }));
    }
  } catch (err) {
    // Fallback a estático si falla la conexión
  }
  return staticArticles;
}

export async function getDynamicArticleBySlug(slug: string): Promise<DynamicArticle | null> {
  try {
    const post = await prisma.post.findFirst({
      where: { slug, published: true },
    });

    if (post) {
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        cover: post.cover,
        metaDescription: post.metaDescription,
        readingTime: post.readingTime,
        body: post.body as any,
      };
    }
  } catch (err) {
    // Fallback a estático
  }
  
  return (staticArticles.find(a => a.slug === slug) as DynamicArticle) || null;
}

export type DynamicSuccessCase = {
  id: number;
  title: string;
  clientName: string;
  logoUrl: string | null;
  coverImage: string;
  description: string;
  metrics: string[];
  content: string;
};

export async function getDynamicSuccessCases(): Promise<DynamicSuccessCase[]> {
  try {
    const cases = await prisma.successCase.findMany({
      where: { active: true },
      orderBy: { id: "desc" },
    });
    return cases.map(c => ({
      id: c.id,
      title: c.title,
      clientName: c.clientName,
      logoUrl: c.logoUrl,
      coverImage: c.coverImage,
      description: c.description,
      metrics: Array.isArray(c.metrics) ? (c.metrics as string[]) : [],
      content: c.content,
    }));
  } catch (err) {
    return []; // Si falla, no mostramos nada (o mockup estático si hubiera, pero no había casos enconstants)
  }
}
