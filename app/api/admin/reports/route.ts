import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import {
  financialOverview,
  salesByPeriod,
  topProducts,
  topAccounts,
  ticketSummary,
  daysSalesOutstanding,
} from "../../../../lib/modules/reports/report-service.ts";
import { REPORT_GROUPINGS, type ReportGrouping } from "../../../../lib/modules/reports/schema.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Endpoint único para los reportes BI. El parámetro `type` selecciona el
 * reporte; `from`/`to` filtran el rango. Útil para alimentar el dashboard
 * y reportes específicos.
 *
 * Tipos soportados:
 *   - overview: KPIs financieros + AR aging + AP + caja
 *   - sales-by-period: serie histórica de ventas
 *   - top-products: ranking de productos vendidos
 *   - top-accounts: cuentas con mayor facturación
 *   - tickets: agregado de tickets por estado/prioridad
 *   - dso: días promedio de cobranza
 */

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "reportes:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "overview";
  const from = parseDate(url.searchParams.get("from"));
  const to = parseDate(url.searchParams.get("to"));
  const groupBy = (REPORT_GROUPINGS as readonly string[]).includes(url.searchParams.get("groupBy") || "")
    ? (url.searchParams.get("groupBy") as ReportGrouping)
    : "month";

  try {
    switch (type) {
      case "overview":
        return adminOk({ data: await financialOverview({ organizationId: auth.orgId, from, to }) });
      case "sales-by-period":
        return adminOk({ data: await salesByPeriod({ organizationId: auth.orgId, from, to, groupBy }) });
      case "top-products":
        return adminOk({ data: await topProducts({ organizationId: auth.orgId, from, to }) });
      case "top-accounts":
        return adminOk({ data: await topAccounts({ organizationId: auth.orgId, from, to }) });
      case "tickets":
        return adminOk({ data: await ticketSummary({ organizationId: auth.orgId, from, to }) });
      case "dso":
        return adminOk({ data: await daysSalesOutstanding({ organizationId: auth.orgId }) });
      default:
        return adminOk({ data: null, error: `Reporte desconocido: ${type}` });
    }
  } catch (error) {
    return adminServerError(`reports.${type}`, error);
  }
}
