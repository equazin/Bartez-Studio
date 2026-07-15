import { NextResponse } from "next/server.js";
import { authorizeModule } from "../../../../../../../lib/modules/admin-module.ts";
import { publishPost } from "../../../../../../../lib/modules/marketing/social-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeModule(request, "marketing:social:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await params;
  try {
    const post = await publishPost(auth.orgId, id);
    return NextResponse.json({ ok: true, post }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
