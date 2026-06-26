import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import { exchangeRateCreateSchema } from "../../../../lib/modules/treasury/schema.ts";
import { getLatestExchangeRate, listExchangeRates, upsertExchangeRate } from "../../../../lib/modules/treasury/exchange-rate-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:cash:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const base = url.searchParams.get("base") || "USD";
  const quote = url.searchParams.get("quote") || "ARS";

  try {
    const [latest, history] = await Promise.all([
      getLatestExchangeRate(base, quote),
      listExchangeRates({ base, quote, limit: 30 }),
    ]);
    return adminOk({ data: { latest, history } });
  } catch (error) {
    return adminServerError("exchangeRates.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "finanzas:cash:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = exchangeRateCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const rate = await upsertExchangeRate(parsed.data);
    await logAudit("create", "exchange_rate", rate.id, { base: rate.base, quote: rate.quote, rate: rate.rate.toString() }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: rate }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("exchangeRates.create", error);
  }
}
