import { NextResponse } from "next/server.js";
import { authorizeAdminRequest } from "../admin-api.ts";
import { can } from "../rbac.ts";
import { resolveOrgId } from "../tenant.ts";
import { checkRateLimit } from "../rate-limit.ts";
import type { AdminSession } from "../auth-token.ts";

const MUTATION_LIMIT = 30;
const MUTATION_WINDOW_MS = 60_000;

/**
 * Boilerplate común para APIs de módulos del Sistema Bartez.
 *
 * Reutilizado por crm/catalog/sales/etc. Centraliza:
 *  - autorización (JWT cookie)
 *  - rate limit a mutaciones
 *  - chequeo RBAC (`can(session, permission)`)
 *  - resolución del organizationId del tenant
 */
export async function authorizeModule(
  request: Request,
  permission: string,
  options: { mutation?: boolean; rateLimitScope?: string } = {},
): Promise<
  | { ok: false; response: NextResponse }
  | { ok: true; session: AdminSession; orgId: string }
> {
  const auth = await authorizeAdminRequest(request, { mutation: options.mutation });
  if (auth.response) return { ok: false, response: auth.response };
  const session = auth.session as AdminSession;

  if (options.mutation) {
    const scope = options.rateLimitScope ?? "admin:module";
    const rate = checkRateLimit(request, scope, MUTATION_LIMIT, MUTATION_WINDOW_MS);
    if (!rate.allowed) {
      return {
        ok: false,
        response: NextResponse.json(
          { ok: false, error: "Demasiadas solicitudes. Probá nuevamente más tarde." },
          { status: 429, headers: { "Retry-After": String(rate.retryAfter), "Cache-Control": "no-store" } },
        ),
      };
    }
  }

  if (!can(session, permission)) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "No tenés permisos para esta acción." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  const orgId = await resolveOrgId(session);
  return { ok: true, session, orgId };
}

export function parseModulePagination(url: URL): { page: number; limit: number; skip: number } {
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 20));
  return { page, limit, skip: (page - 1) * limit };
}
