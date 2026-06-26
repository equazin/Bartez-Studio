// ---------------------------------------------------------------------------
// API pública v1 — autenticación por Bearer token
// El token se configura via env var API_V1_TOKEN
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";

export function authorizeV1Request(request: Request): { ok: true } | { ok: false; response: Response } {
  const token = process.env.API_V1_TOKEN;
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "API v1 no habilitada" }, { status: 503 }),
    };
  }

  const auth = request.headers.get("authorization") || "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (provided !== token) {
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
