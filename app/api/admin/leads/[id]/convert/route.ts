import { getDb } from "../../../../../../lib/db.ts";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { leadConvertSchema } from "../../../../../../lib/modules/crm/schema.ts";
import { authorizeCrm } from "../../../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Convierte un Lead en Account + Contact (idempotente: si el lead ya tiene
 * accountId, devuelve el existente). Vincula el Account creado al Lead.
 */
export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "crm:account:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const leadId = Number(id);
  if (!Number.isFinite(leadId)) return adminOk({ data: null });

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = leadConvertSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  const db = getDb();
  try {
    const lead = await db.lead.findFirst({
      where: { id: leadId, OR: [{ organizationId: auth.orgId }, { organizationId: null }] },
      include: { account: true },
    });
    if (!lead) return adminOk({ data: null });

    if (lead.account) {
      return adminOk({ data: { account: lead.account, alreadyConverted: true } });
    }

    const accountName = parsed.data.accountName?.trim() || lead.company?.trim() || lead.name;

    const account = await db.account.create({
      data: {
        organizationId: auth.orgId,
        name: accountName,
        email: lead.email,
        phone: lead.phone,
      },
    });

    // Contacto a partir del lead (split name "Nombre Apellido")
    const [firstName, ...rest] = lead.name.split(/\s+/);
    const contact = await db.contact.create({
      data: {
        organizationId: auth.orgId,
        accountId: account.id,
        firstName: firstName || lead.name,
        lastName: rest.length > 0 ? rest.join(" ") : null,
        email: lead.email,
        phone: lead.phone,
      },
    });

    await db.lead.update({
      where: { id: leadId },
      data: { accountId: account.id, organizationId: lead.organizationId ?? auth.orgId },
    });

    await logAudit("create", "account", account.id, { fromLeadId: leadId }, { organizationId: auth.orgId });
    return adminOk({ data: { account, contact } });
  } catch (error) {
    return adminServerError("leads.convert", error);
  }
}
