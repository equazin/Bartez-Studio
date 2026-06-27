// ---------------------------------------------------------------------------
// API pública v1 — autenticación por Bearer token
// Lee primero de OrgCredential (configurable desde /admin/sistema) y cae a
// env var API_V1_TOKEN como fallback.
// ---------------------------------------------------------------------------

import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getCredential } from "./modules/system/credentials-service.ts";
import { resolveDefaultOrg } from "./tenant.ts";

/** Comparación en tiempo constante (evita oráculos de tiempo sobre el token). */
function safeEqual(left: string, right: string): boolean {
  return timingSafeEqual(
    createHash("sha256").update(left).digest(),
    createHash("sha256").update(right).digest(),
  );
}

export async function authorizeV1Request(request: Request): Promise<{ ok: true } | { ok: false; response: Response }> {
  const org = await resolveDefaultOrg();
  const token = await getCredential(org.id, "api_v1", "token", "API_V1_TOKEN");
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "API v1 no habilitada" }, { status: 503 }),
    };
  }

  const auth = request.headers.get("authorization") || "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (!provided || !safeEqual(provided, token)) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "Token inválido o ausente" },
        { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
      ),
    };
  }

  return { ok: true };
}

export function v1Ok<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json(
    { ok: true, data, ...(meta ? { meta } : {}) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export function v1Error(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}
