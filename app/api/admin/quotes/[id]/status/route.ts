import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { quoteStatusSchema } from "../../../../../../lib/modules/sales/schema.ts";
import { transitionQuoteStatus } from "../../../../../../lib/modules/sales/quote-service.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Transición de estado del presupuesto (draft → sent → accepted/rejected/expired).
 * Setea sentAt/acceptedAt/rejectedAt según corresponda.
 */
export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = quoteStatusSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const quote = await transitionQuoteStatus({ organizationId: auth.orgId, id, status: parsed.data.status });
    if (!quote) return adminOk({ data: null });
    await logAudit("update", "quote", id, { status: parsed.data.status }, { organizationId: auth.orgId });
    return adminOk({ data: quote });
  } catch (error) {
    return adminServerError("quotes.status", error);
  }
}
