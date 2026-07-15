import { NextResponse } from "next/server.js";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { listAccounts, buildMetaOAuthUrl, isMetaAppConfigured } from "../../../../../lib/modules/marketing/social-service.ts";
import { randomBytes } from "node:crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "marketing:social:read");
  if (!auth.ok) return auth.response;
  const [accounts, configured] = await Promise.all([listAccounts(auth.orgId), isMetaAppConfigured(auth.orgId)]);
  return NextResponse.json({ ok: true, accounts, appConfigured: configured }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "marketing:social:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = (await request.json().catch(() => ({}))) as { action?: string };
  if (body.action !== "connect_meta") {
    return NextResponse.json({ ok: false, error: "Acción inválida" }, { status: 400 });
  }
  try {
    const state = randomBytes(24).toString("hex");
    const { url } = await buildMetaOAuthUrl(auth.orgId, state);
    return NextResponse.json({ ok: true, url, state }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
