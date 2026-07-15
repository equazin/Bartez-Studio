import { NextResponse } from "next/server.js";
import { z } from "zod";
import { authorizeModule } from "../../../../../../../../lib/modules/admin-module.ts";
import { updateGoogleAdsCampaignStatus } from "../../../../../../../../lib/integrations/google-ads-campaigns.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({ status: z.enum(["ENABLED", "PAUSED"]) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeModule(request, "marketing:ads:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "status inválido (ENABLED|PAUSED)" }, { status: 400 });
  }
  try {
    await updateGoogleAdsCampaignStatus(auth.orgId, id, parsed.data.status);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 502 });
  }
}
