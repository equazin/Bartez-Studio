import { NextResponse } from "next/server.js";
import { z } from "zod";
import { logAudit } from "../../../../../../../lib/audit.ts";
import { adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../../../lib/modules/admin-module.ts";
import { deleteCredential, setCredential } from "../../../../../../../lib/modules/system/credentials-service.ts";
import { findIntegration } from "../../../../../../../lib/modules/system/integrations-catalog.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const putSchema = z.object({
  value: z.string().min(1).max(20_000),
});

interface RouteCtx { params: Promise<{ provider: string; key: string }>; }

export async function PUT(request: Request, ctx: RouteCtx) {
  const auth = await authorizeModule(request, "sistema:credentials:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const { provider, key } = await ctx.params;

  const integ = findIntegration(provider);
  if (!integ) return NextResponse.json({ ok: false, error: "Integración desconocida" }, { status: 404 });
  const field = integ.fields.find((f) => f.key === key);
  if (!field) return NextResponse.json({ ok: false, error: "Campo desconocido para esta integración" }, { status: 404 });

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = putSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    await setCredential(auth.orgId, provider, key, parsed.data.value);
    await logAudit("update", "organization", auth.orgId, { credential: `${provider}.${key}`, action: "set" }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("system.credentials.set", error);
  }
}

export async function DELETE(request: Request, ctx: RouteCtx) {
  const auth = await authorizeModule(request, "sistema:credentials:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const { provider, key } = await ctx.params;

  try {
    await deleteCredential(auth.orgId, provider, key);
    await logAudit("delete", "organization", auth.orgId, { credential: `${provider}.${key}`, action: "delete" }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("system.credentials.delete", error);
  }
}
