import { NextRequest } from "next/server";
import { adminOk, adminServerError, authorizeAdminRequest, readAdminJson } from "../../../../../lib/admin-api.ts";
import { getDb } from "../../../../../lib/db.ts";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;

  const { id } = await params;

  try {
    const db = getDb();
    const conversation = await db.waConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return Response.json({ ok: false, error: "Conversación no encontrada" }, { status: 404 });
    }

    return adminOk({ conversation });
  } catch (error) {
    return adminServerError("obtener detalles de conversación", error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const { status, category } = body.data as { status?: string; category?: string };

  try {
    const db = getDb();
    const data: Record<string, any> = {};
    if (status !== undefined) data.status = status;
    if (category !== undefined) data.category = category;

    const updated = await db.waConversation.update({
      where: { id },
      data,
    });

    return adminOk({ conversation: updated });
  } catch (error) {
    return adminServerError("actualizar conversación", error);
  }
}
