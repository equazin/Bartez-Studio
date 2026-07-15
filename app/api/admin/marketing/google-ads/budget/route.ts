import { NextResponse } from "next/server.js";
import { z } from "zod";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";
import { updateGoogleAdsCampaignBudget } from "../../../../../../lib/integrations/google-ads-campaigns.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  budgetResourceName: z.string().min(1),
  dailyAmount: z.number().positive().max(10_000_000),
});

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "marketing:ads:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Payload inválido", issues: parsed.error.issues }, { status: 400 });
  }
  try {
    await updateGoogleAdsCampaignBudget(auth.orgId, parsed.data.budgetResourceName, parsed.data.dailyAmount);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 502 });
  }
}
