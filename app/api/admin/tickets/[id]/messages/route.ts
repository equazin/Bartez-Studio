import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { ticketMessageSchema } from "../../../../../../lib/modules/support/schema.ts";
import { addTicketMessage } from "../../../../../../lib/modules/support/ticket-service.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:ticket:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = ticketMessageSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const message = await addTicketMessage({
      organizationId: auth.orgId,
      id,
      authorType: "user",
      data: { ...parsed.data, authorName: parsed.data.authorName ?? auth.session.username },
    });
    if (!message) return adminOk({ data: null });
    await logAudit("create", "ticket_message", message.id, { ticketId: id, internal: parsed.data.internal }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: message }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("tickets.message", error);
  }
}
