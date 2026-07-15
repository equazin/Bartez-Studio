/**
 * Meta Graph API — cliente para publicación en Facebook Pages e Instagram Business.
 *
 * OAuth: Facebook Login for Business. Se intercambia el `code` por un short-lived
 * user token, se convierte a long-lived (60 días), se listan las páginas y por
 * cada página se obtiene el page access token permanente (mientras la app tenga
 * los permisos concedidos).
 *
 * Publicación:
 *  - Facebook: POST /{page-id}/feed con message + link opcional.
 *  - Instagram: crear un media container y publicarlo (2 pasos).
 *
 * Doc: https://developers.facebook.com/docs/facebook-login/guides/access-tokens
 *      https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 */
import { logger } from "../logger.ts";

const GRAPH_VERSION = "v21.0";
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;
export const META_OAUTH_URL = `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`;
export const META_REQUIRED_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "pages_manage_metadata",
  "instagram_basic",
  "instagram_content_publish",
  "business_management",
] as const;

export interface MetaExchangeCodeInput {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface MetaTokenResponse {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface MetaPageInfo {
  id: string;
  name: string;
  accessToken: string;
  category?: string;
  igBusinessId?: string;
  picture?: string;
}

export interface FacebookPublishInput {
  pageId: string;
  pageAccessToken: string;
  message: string;
  linkUrl?: string;
  /** Si viene, se publica como foto (o primera del carrusel). */
  imageUrl?: string;
}

export interface InstagramPublishInput {
  igBusinessId: string;
  pageAccessToken: string;
  caption: string;
  /** IG requiere al menos una imagen o video. */
  imageUrl?: string;
  videoUrl?: string;
  /** Múltiples items para carrusel. */
  carouselItems?: readonly { imageUrl?: string; videoUrl?: string }[];
}

export interface PublishResult {
  externalPostId: string;
  permalink?: string;
}

interface GraphError {
  error?: { message?: string; code?: number; type?: string };
}

async function graphFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // deja json null
  }
  if (!res.ok) {
    const err = (json as GraphError | null)?.error;
    throw new Error(`Meta Graph HTTP ${res.status}: ${err?.message ?? text.slice(0, 200) ?? "error desconocido"}`);
  }
  return (json ?? {}) as T;
}

/** Paso 1: intercambia el `code` de OAuth por un access_token (short-lived). */
export async function exchangeCodeForToken(input: MetaExchangeCodeInput): Promise<MetaTokenResponse> {
  const url = new URL(`${GRAPH}/oauth/access_token`);
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("client_secret", input.clientSecret);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("code", input.code);
  const json = await graphFetch<{ access_token: string; token_type?: string; expires_in?: number }>(url.toString());
  return { accessToken: json.access_token, tokenType: json.token_type, expiresIn: json.expires_in };
}

/** Paso 2: convierte un short-lived en long-lived (~60 días). */
export async function toLongLivedToken(
  shortLivedToken: string,
  clientId: string,
  clientSecret: string,
): Promise<MetaTokenResponse> {
  const url = new URL(`${GRAPH}/oauth/access_token`);
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("client_secret", clientSecret);
  url.searchParams.set("fb_exchange_token", shortLivedToken);
  const json = await graphFetch<{ access_token: string; token_type?: string; expires_in?: number }>(url.toString());
  return { accessToken: json.access_token, tokenType: json.token_type, expiresIn: json.expires_in };
}

/**
 * Lista páginas gestionadas por el usuario. Cada página trae su propio access
 * token (permanente si el user token era long-lived).
 */
export async function listPages(userAccessToken: string): Promise<MetaPageInfo[]> {
  const url = new URL(`${GRAPH}/me/accounts`);
  url.searchParams.set("fields", "id,name,category,access_token,picture{url},instagram_business_account{id,username}");
  url.searchParams.set("access_token", userAccessToken);
  const json = await graphFetch<{
    data?: Array<{
      id: string;
      name: string;
      category?: string;
      access_token: string;
      picture?: { data?: { url?: string } };
      instagram_business_account?: { id?: string; username?: string };
    }>;
  }>(url.toString());
  return (json.data ?? []).map((page) => ({
    id: page.id,
    name: page.name,
    category: page.category,
    accessToken: page.access_token,
    picture: page.picture?.data?.url,
    igBusinessId: page.instagram_business_account?.id,
  }));
}

/** Publica un post en una Facebook Page. */
export async function publishFacebookPost(input: FacebookPublishInput): Promise<PublishResult> {
  const endpoint = input.imageUrl ? "photos" : "feed";
  const body = new URLSearchParams();
  body.set("access_token", input.pageAccessToken);
  if (input.message) body.set(input.imageUrl ? "caption" : "message", input.message);
  if (input.linkUrl && !input.imageUrl) body.set("link", input.linkUrl);
  if (input.imageUrl) body.set("url", input.imageUrl);

  const json = await graphFetch<{ id?: string; post_id?: string }>(`${GRAPH}/${input.pageId}/${endpoint}`, {
    method: "POST",
    body,
  });
  const externalPostId = json.post_id ?? json.id ?? "";
  if (!externalPostId) throw new Error("Meta no devolvió id del post");
  const permalink = await getFacebookPermalink(externalPostId, input.pageAccessToken).catch(() => undefined);
  return { externalPostId, permalink };
}

async function getFacebookPermalink(postId: string, pageAccessToken: string): Promise<string | undefined> {
  const url = new URL(`${GRAPH}/${postId}`);
  url.searchParams.set("fields", "permalink_url");
  url.searchParams.set("access_token", pageAccessToken);
  const json = await graphFetch<{ permalink_url?: string }>(url.toString());
  return json.permalink_url;
}

/**
 * Publica en Instagram (2 pasos):
 *  1) crear media container(s)
 *  2) publicar el container final
 */
export async function publishInstagramPost(input: InstagramPublishInput): Promise<PublishResult> {
  const carousel = input.carouselItems && input.carouselItems.length > 1 ? input.carouselItems : null;

  let creationId: string;
  if (carousel) {
    const childIds: string[] = [];
    for (const item of carousel) {
      const body = new URLSearchParams();
      body.set("access_token", input.pageAccessToken);
      body.set("is_carousel_item", "true");
      if (item.videoUrl) {
        body.set("media_type", "VIDEO");
        body.set("video_url", item.videoUrl);
      } else if (item.imageUrl) {
        body.set("image_url", item.imageUrl);
      } else {
        throw new Error("Cada item del carrusel necesita imageUrl o videoUrl");
      }
      const child = await graphFetch<{ id: string }>(`${GRAPH}/${input.igBusinessId}/media`, { method: "POST", body });
      childIds.push(child.id);
    }
    const body = new URLSearchParams();
    body.set("access_token", input.pageAccessToken);
    body.set("media_type", "CAROUSEL");
    body.set("children", childIds.join(","));
    body.set("caption", input.caption);
    const container = await graphFetch<{ id: string }>(`${GRAPH}/${input.igBusinessId}/media`, { method: "POST", body });
    creationId = container.id;
  } else {
    const body = new URLSearchParams();
    body.set("access_token", input.pageAccessToken);
    body.set("caption", input.caption);
    if (input.videoUrl) {
      body.set("media_type", "VIDEO");
      body.set("video_url", input.videoUrl);
    } else if (input.imageUrl) {
      body.set("image_url", input.imageUrl);
    } else {
      throw new Error("IG requiere imageUrl o videoUrl");
    }
    const container = await graphFetch<{ id: string }>(`${GRAPH}/${input.igBusinessId}/media`, { method: "POST", body });
    creationId = container.id;
  }

  const publishBody = new URLSearchParams();
  publishBody.set("access_token", input.pageAccessToken);
  publishBody.set("creation_id", creationId);
  const publish = await graphFetch<{ id: string }>(`${GRAPH}/${input.igBusinessId}/media_publish`, {
    method: "POST",
    body: publishBody,
  });
  const permalink = await getInstagramPermalink(publish.id, input.pageAccessToken).catch(() => undefined);
  return { externalPostId: publish.id, permalink };
}

async function getInstagramPermalink(mediaId: string, pageAccessToken: string): Promise<string | undefined> {
  const url = new URL(`${GRAPH}/${mediaId}`);
  url.searchParams.set("fields", "permalink");
  url.searchParams.set("access_token", pageAccessToken);
  const json = await graphFetch<{ permalink?: string }>(url.toString());
  return json.permalink;
}

/** Insights de un post de Facebook (impresiones, alcance, reacciones). */
export async function fetchFacebookPostInsights(
  postId: string,
  pageAccessToken: string,
): Promise<Record<string, number>> {
  const url = new URL(`${GRAPH}/${postId}/insights`);
  url.searchParams.set("metric", "post_impressions,post_impressions_unique,post_reactions_by_type_total,post_clicks");
  url.searchParams.set("access_token", pageAccessToken);
  try {
    const json = await graphFetch<{ data?: Array<{ name: string; values?: Array<{ value: number | Record<string, number> }> }> }>(
      url.toString(),
    );
    const out: Record<string, number> = {};
    for (const item of json.data ?? []) {
      const value = item.values?.[0]?.value;
      if (typeof value === "number") out[item.name] = value;
      else if (value && typeof value === "object") {
        out[item.name] = Object.values(value).reduce((sum, v) => sum + (typeof v === "number" ? v : 0), 0);
      }
    }
    return out;
  } catch (error) {
    logger.error("meta-graph.insights.fb", error);
    return {};
  }
}

/** Insights de un media de Instagram. */
export async function fetchInstagramMediaInsights(
  mediaId: string,
  pageAccessToken: string,
): Promise<Record<string, number>> {
  const url = new URL(`${GRAPH}/${mediaId}/insights`);
  url.searchParams.set("metric", "impressions,reach,likes,comments,saved,shares");
  url.searchParams.set("access_token", pageAccessToken);
  try {
    const json = await graphFetch<{ data?: Array<{ name: string; values?: Array<{ value: number }> }> }>(url.toString());
    const out: Record<string, number> = {};
    for (const item of json.data ?? []) {
      const value = item.values?.[0]?.value;
      if (typeof value === "number") out[item.name] = value;
    }
    return out;
  } catch (error) {
    logger.error("meta-graph.insights.ig", error);
    return {};
  }
}
