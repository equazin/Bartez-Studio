/**
 * Captura de atribución publicitaria en el sitio público (client-side).
 *
 * Estrategia first-touch: la primera vez que un visitante llega con UTMs o
 * click IDs (gclid/fbclid), se persisten en una cookie por 90 días. Así, aunque
 * el lead complete el formulario varias páginas después, conservamos de qué
 * campaña vino. Si ya hay atribución guardada, no se pisa (first-touch gana).
 *
 * Pensado para importarse desde componentes client ("use client").
 */
import type { Attribution } from "./schema.ts";

const COOKIE_NAME = "bz_attr";
const MAX_AGE_DAYS = 90;

const UTM_KEYS = ["utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm"] as const;
const PARAM_MAP: Record<string, keyof NonNullable<Attribution>> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
  gclid: "gclid",
  fbclid: "fbclid",
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function hasSignal(attr: Attribution): boolean {
  if (!attr) return false;
  return Boolean(
    attr.gclid || attr.fbclid || UTM_KEYS.some((k) => attr[k]),
  );
}

/** Lee la atribución de la URL actual (params), sin tocar la cookie. */
function fromCurrentUrl(): Attribution {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const attr: NonNullable<Attribution> = {};
  for (const [param, field] of Object.entries(PARAM_MAP)) {
    const value = params.get(param);
    if (value) attr[field] = value.slice(0, 255);
  }
  return Object.keys(attr).length > 0 ? attr : undefined;
}

/**
 * Persiste la atribución de la URL actual como first-touch si todavía no había.
 * Llamar una vez al cargar el sitio (ej. en un layout/provider client).
 */
export function captureFirstTouch(): void {
  if (typeof window === "undefined") return;
  const existing = readCookie(COOKIE_NAME);
  if (existing) return; // first-touch ya registrado
  const fromUrl = fromCurrentUrl();
  if (!hasSignal(fromUrl)) return;
  const payload: NonNullable<Attribution> = {
    ...fromUrl,
    landingUrl: window.location.href.slice(0, 500),
  };
  writeCookie(COOKIE_NAME, JSON.stringify(payload), MAX_AGE_DAYS);
}

/**
 * Devuelve la mejor atribución disponible para adjuntar a un lead:
 * first-touch de la cookie, completada con la URL actual si la cookie no existe.
 */
export function getAttribution(): Attribution {
  const stored = readCookie(COOKIE_NAME);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as NonNullable<Attribution>;
      if (hasSignal(parsed)) return parsed;
    } catch {
      // cookie corrupta → ignorar y caer a URL
    }
  }
  const fromUrl = fromCurrentUrl();
  if (hasSignal(fromUrl) && typeof window !== "undefined") {
    return { ...fromUrl, landingUrl: window.location.href.slice(0, 500) };
  }
  return undefined;
}
