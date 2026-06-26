import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { getTrialBalance } from "../../../../../lib/modules/accounting/accounting-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:accounting:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const from = parseDate(url.searchParams.get("from"));
  const to = parseDate(url.searchParams.get("to"));

  try {
    const data = await getTrialBalance({ organizationId: auth.orgId, from, to });
    return adminOk({ data });
  } catch (error) {
    return adminServerError("accounting.trialBalance", error);
  }
}
