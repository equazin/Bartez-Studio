import { NextResponse } from "next/server.js";
import type { ZodIssue } from "zod";
import { tokenFromCookieHeader, verifyToken } from "./auth-token.ts";

const MAX_JSON_BYTES = 256 * 1024;

export async function authorizeAdminRequest(request: Request, options: { mutation?: boolean } = {}) {
  const token = tokenFromCookieHeader(request.headers.get("cookie"));
  const session = token ? await verifyToken(token) : null;
  if (!session) {
    return { session: null, response: NextResponse.json(
      { ok: false, error: "No autorizado" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    ) };
  }
  if (options.mutation && !isSameOrigin(request)) {
    return { session: null, response: NextResponse.json(
      { ok: false, error: "Origen no permitido" },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    ) };
  }
  return { session, response: null };
}

export function isSameOrigin(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

export async function readAdminJson(request: Request) {
  const length = Number(request.headers.get("content-length") || "0");
  if (length > MAX_JSON_BYTES) {
    return { ok: false as const, response: NextResponse.json({ ok: false, error: "Solicitud demasiado grande" }, { status: 413 }) };
  }
  try {
    return { ok: true as const, data: await request.json() as unknown };
  } catch {
    return { ok: false as const, response: NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 }) };
  }
}

export function invalidAdminInput(issues: ZodIssue[]) {
  return NextResponse.json({
    ok: false,
    error: "Revisá los campos marcados.",
    issues: issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
  }, { status: 422, headers: { "Cache-Control": "no-store" } });
}

export function adminServerError(context: string, error: unknown) {
  console.error(`[admin] ${context}`, error);
  return NextResponse.json(
    { ok: false, error: "No pudimos completar la operación." },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}

export function adminOk<T extends Record<string, unknown>>(payload: T = {} as T) {
  return NextResponse.json({ ok: true, ...payload }, { headers: { "Cache-Control": "no-store" } });
}
