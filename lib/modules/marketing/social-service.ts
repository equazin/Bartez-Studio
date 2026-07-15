/**
 * Redes sociales — servicio del módulo marketing.
 *
 * Encapsula el ciclo de vida de las cuentas conectadas (SocialAccount) y de los
 * posts (SocialPost). Los access tokens NUNCA se guardan en SocialAccount; se
 * guardan cifrados en OrgCredential con provider "meta_social" y key
 * "<accountId>:token". Así el modelo público no lleva secretos.
 */
import { getDb } from "../../db.ts";
import { logger } from "../../logger.ts";
import { getCredential, setCredential, deleteCredential } from "../system/credentials-service.ts";
import {
  META_OAUTH_URL,
  META_REQUIRED_SCOPES,
  exchangeCodeForToken,
  toLongLivedToken,
  listPages,
  publishFacebookPost,
  publishInstagramPost,
  fetchFacebookPostInsights,
  fetchInstagramMediaInsights,
  type MetaPageInfo,
} from "../../integrations/meta-graph.ts";

export type SocialProvider = "facebook" | "instagram";
export type SocialPostStatus = "draft" | "scheduled" | "publishing" | "published" | "failed" | "canceled";
export type SocialPostKind = "text" | "image" | "carousel" | "video";

const CRED_PROVIDER = "meta_social";
const APP_CRED_PROVIDER = "meta_app";

export interface CreatePostInput {
  socialAccountId: string;
  caption: string;
  mediaUrls?: readonly string[];
  linkUrl?: string;
  scheduledAt?: Date | null;
  createdById?: string;
}

export interface SocialAccountSummary {
  id: string;
  provider: SocialProvider;
  externalId: string;
  name: string;
  avatarUrl: string | null;
  pageId: string | null;
  igBusinessId: string | null;
  tokenExpiresAt: string | null;
  connectedAt: string;
  disconnectedAt: string | null;
  lastError: string | null;
}

export interface SocialPostSummary {
  id: string;
  socialAccountId: string;
  accountName: string;
  accountProvider: SocialProvider;
  kind: SocialPostKind;
  caption: string;
  mediaUrls: string[];
  linkUrl: string | null;
  status: SocialPostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  permalink: string | null;
  externalPostId: string | null;
  error: string | null;
  insights: Record<string, number> | null;
  insightsSyncedAt: string | null;
  createdAt: string;
}

function tokenKey(accountId: string): string {
  return `${accountId}:token`;
}

async function getAppCreds(organizationId: string): Promise<{ clientId: string; clientSecret: string; redirectUri: string } | null> {
  const [clientId, clientSecret, redirectUri] = await Promise.all([
    getCredential(organizationId, APP_CRED_PROVIDER, "app_id", "META_APP_ID"),
    getCredential(organizationId, APP_CRED_PROVIDER, "app_secret", "META_APP_SECRET"),
    getCredential(organizationId, APP_CRED_PROVIDER, "redirect_uri", "META_APP_REDIRECT_URI"),
  ]);
  if (!clientId || !clientSecret || !redirectUri) return null;
  return { clientId, clientSecret, redirectUri };
}

export async function isMetaAppConfigured(organizationId: string): Promise<boolean> {
  return (await getAppCreds(organizationId)) !== null;
}

export interface BuildOAuthUrlResult {
  url: string;
  state: string;
}

export async function buildMetaOAuthUrl(organizationId: string, state: string): Promise<BuildOAuthUrlResult> {
  const app = await getAppCreds(organizationId);
  if (!app) throw new Error("Meta App no configurada (definir META_APP_ID / META_APP_SECRET / META_APP_REDIRECT_URI).");
  const url = new URL(META_OAUTH_URL);
  url.searchParams.set("client_id", app.clientId);
  url.searchParams.set("redirect_uri", app.redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", [...META_REQUIRED_SCOPES].join(","));
  return { url: url.toString(), state };
}

function pageToProviders(page: MetaPageInfo): SocialProvider[] {
  const providers: SocialProvider[] = ["facebook"];
  if (page.igBusinessId) providers.push("instagram");
  return providers;
}

/**
 * Callback del OAuth: intercambia el code, obtiene páginas y persiste una
 * SocialAccount por cada provider (FB + IG si aplica). Retorna cuántas
 * cuentas quedaron conectadas.
 */
export async function completeMetaOAuth(input: {
  organizationId: string;
  code: string;
  connectedById?: string;
}): Promise<{ accounts: SocialAccountSummary[] }> {
  const app = await getAppCreds(input.organizationId);
  if (!app) throw new Error("Meta App no configurada");

  const short = await exchangeCodeForToken({
    code: input.code,
    clientId: app.clientId,
    clientSecret: app.clientSecret,
    redirectUri: app.redirectUri,
  });
  const long = await toLongLivedToken(short.accessToken, app.clientId, app.clientSecret);
  const pages = await listPages(long.accessToken);
  if (pages.length === 0) throw new Error("El usuario no tiene páginas gestionadas.");

  const db = getDb();
  const summaries: SocialAccountSummary[] = [];
  const expiresAt = long.expiresIn ? new Date(Date.now() + long.expiresIn * 1000) : null;

  for (const page of pages) {
    for (const provider of pageToProviders(page)) {
      const externalId = provider === "instagram" ? (page.igBusinessId ?? page.id) : page.id;
      const account = await db.socialAccount.upsert({
        where: {
          organizationId_provider_externalId: {
            organizationId: input.organizationId,
            provider,
            externalId,
          },
        },
        create: {
          organizationId: input.organizationId,
          provider,
          externalId,
          name: page.name,
          avatarUrl: page.picture ?? null,
          pageId: page.id,
          igBusinessId: page.igBusinessId ?? null,
          tokenExpiresAt: expiresAt,
          scopes: [...META_REQUIRED_SCOPES].join(","),
          connectedById: input.connectedById,
          disconnectedAt: null,
          lastError: null,
        },
        update: {
          name: page.name,
          avatarUrl: page.picture ?? null,
          pageId: page.id,
          igBusinessId: page.igBusinessId ?? null,
          tokenExpiresAt: expiresAt,
          scopes: [...META_REQUIRED_SCOPES].join(","),
          connectedById: input.connectedById,
          disconnectedAt: null,
          lastError: null,
        },
      });
      await setCredential(input.organizationId, CRED_PROVIDER, tokenKey(account.id), page.accessToken);
      summaries.push(toAccountSummary(account));
    }
  }
  return { accounts: summaries };
}

export async function listAccounts(organizationId: string): Promise<SocialAccountSummary[]> {
  const rows = await getDb().socialAccount.findMany({
    where: { organizationId, disconnectedAt: null },
    orderBy: [{ provider: "asc" }, { name: "asc" }],
  });
  return rows.map(toAccountSummary);
}

export async function disconnectAccount(organizationId: string, accountId: string): Promise<void> {
  const account = await getDb().socialAccount.findFirst({ where: { id: accountId, organizationId } });
  if (!account) throw new Error("Cuenta no encontrada");
  await getDb().socialAccount.update({
    where: { id: accountId },
    data: { disconnectedAt: new Date() },
  });
  await deleteCredential(organizationId, CRED_PROVIDER, tokenKey(accountId)).catch(() => {});
}

function normalizeKind(mediaUrls: readonly string[]): SocialPostKind {
  if (mediaUrls.length === 0) return "text";
  if (mediaUrls.length > 1) return "carousel";
  const url = mediaUrls[0].toLowerCase();
  if (url.endsWith(".mp4") || url.endsWith(".mov") || url.includes(".mp4?")) return "video";
  return "image";
}

export async function createPost(organizationId: string, input: CreatePostInput): Promise<SocialPostSummary> {
  const media = input.mediaUrls ?? [];
  const account = await getDb().socialAccount.findFirst({
    where: { id: input.socialAccountId, organizationId, disconnectedAt: null },
  });
  if (!account) throw new Error("Cuenta social no encontrada o desconectada");

  const kind = normalizeKind(media);
  if (account.provider === "instagram" && kind === "text") {
    throw new Error("Instagram requiere al menos una imagen o video.");
  }

  const status: SocialPostStatus = input.scheduledAt && input.scheduledAt.getTime() > Date.now() ? "scheduled" : "draft";

  const created = await getDb().socialPost.create({
    data: {
      organizationId,
      socialAccountId: account.id,
      kind,
      caption: input.caption,
      mediaUrls: media as unknown as object,
      linkUrl: input.linkUrl ?? null,
      scheduledAt: input.scheduledAt ?? null,
      status,
      createdById: input.createdById,
    },
    include: { account: true },
  });
  return toPostSummary(created);
}

export async function listPosts(
  organizationId: string,
  filter: { status?: SocialPostStatus } = {},
): Promise<SocialPostSummary[]> {
  const posts = await getDb().socialPost.findMany({
    where: { organizationId, ...(filter.status ? { status: filter.status } : {}) },
    include: { account: true },
    orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
    take: 200,
  });
  return posts.map(toPostSummary);
}

export async function cancelPost(organizationId: string, postId: string): Promise<void> {
  const post = await getDb().socialPost.findFirst({ where: { id: postId, organizationId } });
  if (!post) throw new Error("Post no encontrado");
  if (post.status === "published") throw new Error("El post ya está publicado.");
  await getDb().socialPost.update({ where: { id: postId }, data: { status: "canceled" } });
}

/**
 * Publica un post ya persistido. Marca 'publishing' → 'published' | 'failed'.
 * Idempotente: si ya está 'published', devuelve el resumen sin re-publicar.
 */
export async function publishPost(organizationId: string, postId: string): Promise<SocialPostSummary> {
  const db = getDb();
  const post = await db.socialPost.findFirst({
    where: { id: postId, organizationId },
    include: { account: true },
  });
  if (!post) throw new Error("Post no encontrado");
  if (post.status === "published") return toPostSummary(post);
  if (post.status === "canceled") throw new Error("El post fue cancelado.");
  if (!post.account || post.account.disconnectedAt) throw new Error("La cuenta está desconectada.");

  await db.socialPost.update({
    where: { id: postId },
    data: { status: "publishing", attempts: { increment: 1 }, error: null },
  });

  try {
    const token = await getCredential(organizationId, CRED_PROVIDER, tokenKey(post.socialAccountId));
    if (!token) throw new Error("Sin access token para la cuenta (reconectar).");

    const media = Array.isArray(post.mediaUrls) ? (post.mediaUrls as string[]) : [];
    let result;
    if (post.account.provider === "facebook") {
      result = await publishFacebookPost({
        pageId: post.account.pageId ?? post.account.externalId,
        pageAccessToken: token,
        message: post.caption,
        linkUrl: post.linkUrl ?? undefined,
        imageUrl: media[0],
      });
    } else {
      const igId = post.account.igBusinessId ?? post.account.externalId;
      result = await publishInstagramPost({
        igBusinessId: igId,
        pageAccessToken: token,
        caption: post.caption,
        imageUrl: media.length === 1 ? media[0] : undefined,
        carouselItems: media.length > 1 ? media.map((url) => ({ imageUrl: url })) : undefined,
      });
    }

    const updated = await db.socialPost.update({
      where: { id: postId },
      data: {
        status: "published",
        publishedAt: new Date(),
        externalPostId: result.externalPostId,
        permalink: result.permalink ?? null,
        error: null,
      },
      include: { account: true },
    });
    return toPostSummary(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    logger.error("marketing.social.publish", error);
    const failed = await db.socialPost.update({
      where: { id: postId },
      data: { status: "failed", error: message },
      include: { account: true },
    });
    throw new Error(message, { cause: failed });
  }
}

/** Publica todos los posts programados cuyo scheduledAt ya pasó. */
export async function runScheduler(organizationId: string, now = new Date()): Promise<{ published: number; failed: number }> {
  const db = getDb();
  const due = await db.socialPost.findMany({
    where: { organizationId, status: "scheduled", scheduledAt: { lte: now } },
    select: { id: true },
    take: 50,
  });
  let published = 0;
  let failed = 0;
  for (const row of due) {
    try {
      await publishPost(organizationId, row.id);
      published++;
    } catch {
      failed++;
    }
  }
  return { published, failed };
}

/** Refresca insights de los posts publicados en las últimas N horas. */
export async function syncInsights(organizationId: string, sinceHours = 72): Promise<{ synced: number }> {
  const db = getDb();
  const since = new Date(Date.now() - sinceHours * 3_600_000);
  const posts = await db.socialPost.findMany({
    where: { organizationId, status: "published", publishedAt: { gte: since }, externalPostId: { not: null } },
    include: { account: true },
    take: 100,
  });
  let synced = 0;
  for (const post of posts) {
    if (!post.externalPostId || !post.account) continue;
    const token = await getCredential(organizationId, CRED_PROVIDER, tokenKey(post.socialAccountId));
    if (!token) continue;
    const insights = post.account.provider === "facebook"
      ? await fetchFacebookPostInsights(post.externalPostId, token)
      : await fetchInstagramMediaInsights(post.externalPostId, token);
    await db.socialPost.update({
      where: { id: post.id },
      data: { insights: insights as unknown as object, insightsSyncedAt: new Date() },
    });
    synced++;
  }
  return { synced };
}

// ─── Mappers ──────────────────────────────────────────────────

interface SocialAccountRow {
  id: string;
  provider: string;
  externalId: string;
  name: string;
  avatarUrl: string | null;
  pageId: string | null;
  igBusinessId: string | null;
  tokenExpiresAt: Date | null;
  connectedAt: Date;
  disconnectedAt: Date | null;
  lastError: string | null;
}

function toAccountSummary(row: SocialAccountRow): SocialAccountSummary {
  return {
    id: row.id,
    provider: row.provider as SocialProvider,
    externalId: row.externalId,
    name: row.name,
    avatarUrl: row.avatarUrl,
    pageId: row.pageId,
    igBusinessId: row.igBusinessId,
    tokenExpiresAt: row.tokenExpiresAt ? row.tokenExpiresAt.toISOString() : null,
    connectedAt: row.connectedAt.toISOString(),
    disconnectedAt: row.disconnectedAt ? row.disconnectedAt.toISOString() : null,
    lastError: row.lastError,
  };
}

interface SocialPostRow {
  id: string;
  socialAccountId: string;
  account: SocialAccountRow | null;
  kind: string;
  caption: string;
  mediaUrls: unknown;
  linkUrl: string | null;
  status: string;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  permalink: string | null;
  externalPostId: string | null;
  error: string | null;
  insights: unknown;
  insightsSyncedAt: Date | null;
  createdAt: Date;
}

function toPostSummary(row: SocialPostRow): SocialPostSummary {
  return {
    id: row.id,
    socialAccountId: row.socialAccountId,
    accountName: row.account?.name ?? "—",
    accountProvider: (row.account?.provider ?? "facebook") as SocialProvider,
    kind: row.kind as SocialPostKind,
    caption: row.caption,
    mediaUrls: Array.isArray(row.mediaUrls) ? (row.mediaUrls as string[]) : [],
    linkUrl: row.linkUrl,
    status: row.status as SocialPostStatus,
    scheduledAt: row.scheduledAt ? row.scheduledAt.toISOString() : null,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    permalink: row.permalink,
    externalPostId: row.externalPostId,
    error: row.error,
    insights: row.insights && typeof row.insights === "object" ? (row.insights as Record<string, number>) : null,
    insightsSyncedAt: row.insightsSyncedAt ? row.insightsSyncedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}
