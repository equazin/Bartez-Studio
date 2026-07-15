import { NextResponse } from "next/server.js";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";
import { listGoogleAdsCampaigns } from "../../../../../../lib/integrations/google-ads-campaigns.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "marketing:ads:read");
  if (!auth.ok) return auth.response;
  try {
    const result = await listGoogleAdsCampaigns(auth.orgId);
    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 502 });
  }
}
