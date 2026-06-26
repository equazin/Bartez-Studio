import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server.js";
import { adminLoginSchema } from "../../../../lib/admin-schema.ts";
import { ADMIN_COOKIE_NAME, signToken } from "../../../../lib/auth.ts";
import { logger } from "../../../../lib/logger.ts";
import { checkRateLimit } from "../../../../lib/rate-limit.ts";
import { authenticateUser } from "../../../../lib/modules/team/team-service.ts";

export const runtime = "nodejs";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 6 * 60 * 60,
  path: "/",
  priority: "high" as const,
};

function safeEqual(left: string, right: string) {
  return timingSafeEqual(
    createHash("sha256").update(left).digest(),
    createHash("sha256").update(right).digest(),
  );
}

function sessionResponse(token: string) {
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_COOKIE_NAME, token, COOKIE_OPTS);
  return response;
}

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Usuario o contraseña incorrectos" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const rate = checkRateLimit(request, "admin-login", 5, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Demasiados intentos. Probá nuevamente más tarde." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter), "Cache-Control": "no-store" } },
    );
  }

  let input: unknown;
  try { input = await request.json(); } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }
  const parsed = adminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
  }

  // Firmar tokens requiere el secreto JWT; sin él el panel no opera.
  if (!process.env.ADMIN_JWT_SECRET || process.env.ADMIN_JWT_SECRET.length < 32) {
    logger.error("admin.login.config", "Falta ADMIN_JWT_SECRET (>=32 chars)");
    return NextResponse.json(
      { ok: false, error: "El panel no está disponible temporalmente." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  // 1) Usuario real de la BD (email o nombre + contraseña hasheada con scrypt).
  //    El token lleva userId/orgId/role → el RBAC granular se aplica de verdad.
  try {
    const authed = await authenticateUser(parsed.data.username, parsed.data.password);
    if (authed) {
      const token = await signToken({ username: authed.name, userId: authed.userId, orgId: authed.orgId, role: authed.role });
      return sessionResponse(token);
    }
  } catch (error) {
    logger.error("admin.login.db", error);
    // Seguimos al fallback env; no filtramos el error al cliente.
  }

  // 2) Fallback: admin global por env var (compat. y bootstrap sin usuarios en BD).
  const envUser = process.env.ADMIN_USERNAME || "admin";
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword && safeEqual(parsed.data.username, envUser) && safeEqual(parsed.data.password, envPassword)) {
    const token = await signToken(envUser);
    return sessionResponse(token);
  }

  return unauthorized();
}
