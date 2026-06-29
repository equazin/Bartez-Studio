import { NextResponse } from "next/server.js";
import { z } from "zod";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { getDb } from "../../../../../lib/db.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "sistema:sequences:manage");
  if (!auth.ok) return auth.response;
  try {
    const data = await getDb().sequence.findMany({
      where: { organizationId: auth.orgId },
      orderBy: [{ docType: "asc" }, { pointOfSale: "asc" }],
    });
    return adminOk({ data });
  } catch (error) {
    return adminServerError("system.sequences.list", error);
  }
}

const updateSchema = z.object({
  docType: z.string().trim().min(1).max(40),
  pointOfSale: z.union([z.number(), z.string()]).transform((v) => Number(v)).refine((v) => Number.isInteger(v) && v >= 1 && v <= 99999),
  nextNumber: z.union([z.number(), z.string()]).transform((v) => Number(v)).refine((v) => Number.isInteger(v) && v >= 1),
});

export async function PUT(request: Request) {
  const auth = await authorizeModule(request, "sistema:sequences:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = updateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    // Validar que no retroceda (riesgo fiscal: AFIP requiere numeración ascendente)
    const existing = await getDb().sequence.findUnique({
      where: {
        organizationId_docType_pointOfSale: {
          organizationId: auth.orgId,
          docType: parsed.data.docType,
          pointOfSale: parsed.data.pointOfSale,
        },
      },
      select: { nextNumber: true },
    });
    if (existing && parsed.data.nextNumber < existing.nextNumber) {
      return NextResponse.json(
        { ok: false, error: `No se puede retroceder la numeración (actual: ${existing.nextNumber})` },
        { status: 400 },
      );
    }

    const updated = await getDb().sequence.upsert({
      where: {
        organizationId_docType_pointOfSale: {
          organizationId: auth.orgId,
          docType: parsed.data.docType,
          pointOfSale: parsed.data.pointOfSale,
        },
      },
      create: {
        organizationId: auth.orgId,
        docType: parsed.data.docType,
        pointOfSale: parsed.data.pointOfSale,
        nextNumber: parsed.data.nextNumber,
      },
      update: { nextNumber: parsed.data.nextNumber },
    });
    await logAudit("update", "organization", auth.orgId, { sequence: `${parsed.data.docType}/${parsed.data.pointOfSale}`, nextNumber: parsed.data.nextNumber }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: updated }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("system.sequences.update", error);
  }
}
