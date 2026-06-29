import { NextResponse } from "next/server.js";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { syncAdAttributionMetrics } from "../../../../../lib/modules/ads/performance-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "marketing:ads:manage", { mutation: true });
  if (!auth.ok) return auth.response;

  const form = await request.formData().catch(() => null);
  const days = Math.min(90, Math.max(7, Number(form?.get("days")) || 30));
  const result = await syncAdAttributionMetrics(auth.orgId, days);

  const referer = request.headers.get("referer");
  if (referer) {
    return NextResponse.redirect(new URL(`/admin/ads?days=${days}`, referer), { status: 303 });
  }
  return NextResponse.json({ ok: true, data: result }, { headers: { "Cache-Control": "no-store" } });
}
