import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { searchAirProducts } from "../../../../../lib/integrations/air/service.ts";
import { isAirEnabled } from "../../../../../lib/integrations/air/config.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Búsqueda de productos AIR para el picker del pedido de venta.
 *   ?q=texto           coincide en codiart o name
 *   ?rubro=Bombas      filtro estricto
 *   ?limit=30          1..100 (default 30)
 *   ?onlyActive=false  incluye inactivos (default: solo activos)
 */
export async function GET(request: Request) {
  // Permiso mínimo: quien puede leer una orden de venta puede ver el catálogo AIR.
  const auth = await authorizeModule(request, "ventas:order:read");
  if (!auth.ok) return auth.response;

  if (!(await isAirEnabled(auth.orgId))) {
    return adminOk({ data: { enabled: false, products: [] } });
  }

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";
    const rubro = url.searchParams.get("rubro") ?? undefined;
    const limitRaw = url.searchParams.get("limit");
    const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;
    const onlyActive = url.searchParams.get("onlyActive") === "false" ? false : true;
    const products = await searchAirProducts(auth.orgId, { query, rubro, limit, onlyActive });
    return adminOk({ data: { enabled: true, products } });
  } catch (error) {
    return adminServerError("air.products.search", error);
  }
}
