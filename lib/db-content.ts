import { bodyBlockSchema } from "./admin-schema.ts";
import { getDb } from "./db.ts";
import { partners as staticPartners, articles as staticArticles } from "../constants.ts";
import { staticSuccessCases } from "./success-cases.ts";

export type DynamicBrand = { name: string; logo: string };
export type DynamicClient = { name: string; logo: string };
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
export type DynamicSuccessCase = {
  id: number;
  title: string;
  clientName: string;
  logoUrl: string | null;
  coverImage: string;
  description: string;
  metrics: string[];
  content: string;
  // Campos opcionales — solo presentes en casos estáticos (lib/success-cases.ts)
  // hasta que el modelo Prisma SuccessCase los incorpore. Distinguen un
  // proyecto puntual de una cuenta con compras recurrentes.
  industry?: string;
  relationship?: "puntual" | "recurrente";
  cadence?: string;
};

function hasDatabase() {
  return Boolean(process.env.POSTGRES_PRISMA_URL);
}

function articleBody(value: unknown) {
  const parsed = bodyBlockSchema.array().safeParse(value);
  return parsed.success ? parsed.data : [];
}

export async function getDynamicPartners(): Promise<DynamicBrand[]> {
  return staticPartners.brands;
}

export async function getDynamicClients(): Promise<DynamicClient[]> {
  if (!hasDatabase()) return [];
  try {
    const clients = await getDb().clientLogo.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
    });
    return clients.map((client) => ({ name: client.name, logo: client.logoUrl }));
  } catch (error) {
    console.error("[content] No se pudieron cargar logos de clientes.", error);
    return [];
  }
}

export async function getDynamicArticles(): Promise<DynamicArticle[]> {
  if (!hasDatabase()) return staticArticles;
  try {
    const posts = await getDb().post.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });
    if (posts.length === 0) return staticArticles;
    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      cover: post.cover,
      metaDescription: post.metaDescription,
      readingTime: post.readingTime,
      body: articleBody(post.body),
    }));
  } catch (error) {
    console.error("[content] No se pudieron cargar artículos dinámicos.", error);
    return staticArticles;
  }
}

export async function getDynamicArticleBySlug(slug: string, opts?: { preview?: boolean }): Promise<DynamicArticle | null> {
  if (hasDatabase()) {
    try {
      const where = opts?.preview ? { slug } : { slug, published: true };
      const post = await getDb().post.findFirst({ where });
      if (post) {
        return {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          cover: post.cover,
          metaDescription: post.metaDescription,
          readingTime: post.readingTime,
          body: articleBody(post.body),
        };
      }
    } catch (error) {
      console.error("[content] No se pudo cargar el artículo dinámico.", error);
    }
  }
  return staticArticles.find((article) => article.slug === slug) || null;
}

export async function getDynamicSuccessCases(): Promise<DynamicSuccessCase[]> {
  if (!hasDatabase()) return staticSuccessCases;
  try {
    const cases = await getDb().successCase.findMany({
      where: { active: true },
      orderBy: { id: "desc" },
    });
    if (cases.length === 0) return staticSuccessCases;
    return cases.map((item) => ({
      id: item.id,
      title: item.title,
      clientName: item.clientName,
      logoUrl: item.logoUrl,
      coverImage: item.coverImage,
      description: item.description,
      metrics: Array.isArray(item.metrics) ? item.metrics.filter((metric): metric is string => typeof metric === "string") : [],
      content: item.content,
    }));
  } catch (error) {
    console.error("[content] No se pudieron cargar casos dinámicos.", error);
    return staticSuccessCases;
  }
}

export async function getDynamicSuccessCaseById(id: number) {
  const staticMatch = staticSuccessCases.find((item) => item.id === id) ?? null;
  if (!hasDatabase()) return staticMatch;
  try {
    const item = await getDb().successCase.findFirst({ where: { id, active: true } });
    if (!item) return staticMatch;
    return {
      id: item.id,
      title: item.title,
      clientName: item.clientName,
      logoUrl: item.logoUrl,
      coverImage: item.coverImage,
      description: item.description,
      metrics: Array.isArray(item.metrics) ? item.metrics.filter((metric): metric is string => typeof metric === "string") : [],
      content: item.content,
    } satisfies DynamicSuccessCase;
  } catch (error) {
    console.error("[content] No se pudo cargar el caso.", error);
    return staticMatch;
  }
}
