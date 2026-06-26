import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { ticketStatusSchema } from "../../../../../../lib/modules/support/schema.ts";
import { transitionTicketStatus, TicketValidationError } from "../../../../../../lib/modules/support/ticket-service.ts";
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
  const parsed = ticketStatusSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const ticket = await transitionTicketStatus({
      organizationId: auth.orgId,
      id,
      target: parsed.data.status,
      resolutionNotes: parsed.data.resolutionNotes,
    });
    if (!ticket) return adminOk({ data: null });
    await logAudit("update", "ticket", id, { status: parsed.data.status }, { organizationId: auth.orgId });
    return adminOk({ data: ticket });
  } catch (error) {
    if (error instanceof TicketValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("tickets.status", error);
  }
}
