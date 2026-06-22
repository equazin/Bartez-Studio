import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server.js";
import { adminLoginSchema } from "../../../../lib/admin-schema.ts";
import { ADMIN_COOKIE_NAME, signToken } from "../../../../lib/auth.ts";
import { checkRateLimit } from "../../../../lib/rate-limit.ts";

export const runtime = "nodejs";

function safeEqual(left: string, right: string) {
  return timingSafeEqual(
    createHash("sha256").update(left).digest(),
    createHash("sha256").update(right).digest(),
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

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;
  const configured = Boolean(password && process.env.ADMIN_JWT_SECRET && process.env.ADMIN_JWT_SECRET.length >= 32);
  if (!configured || !password) {
    console.error("[admin] Faltan ADMIN_PASSWORD o ADMIN_JWT_SECRET.");
    return NextResponse.json(
      { ok: false, error: "El panel no está disponible temporalmente." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!safeEqual(parsed.data.username, username) || !safeEqual(parsed.data.password, password)) {
    return NextResponse.json(
      { ok: false, error: "Usuario o contraseña incorrectos" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const token = await signToken(username);
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 6 * 60 * 60,
    path: "/",
    priority: "high",
  });
  return response;
}
