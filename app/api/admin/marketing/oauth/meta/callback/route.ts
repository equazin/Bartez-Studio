import { NextResponse } from "next/server.js";
import { getAdminSession } from "../../../../../../../lib/auth.ts";
import { resolveOrgId } from "../../../../../../../lib/tenant.ts";
import { completeMetaOAuth } from "../../../../../../../lib/modules/marketing/social-service.ts";
import { logger } from "../../../../../../../lib/logger.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function redirectBack(request: Request, params: Record<string, string>): NextResponse {
  const url = new URL("/admin/marketing", request.url);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return NextResponse.redirect(url, { status: 303 });
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error_description") ?? url.searchParams.get("error");
  if (error) return redirectBack(request, { meta_error: error });
  if (!code) return redirectBack(request, { meta_error: "Falta code" });

  try {
    const orgId = await resolveOrgId(session);
    const result = await completeMetaOAuth({ organizationId: orgId, code, connectedById: session.userId });
    return redirectBack(request, { meta_connected: String(result.accounts.length) });
  } catch (err) {
    logger.error("marketing.oauth.meta", err);
    return redirectBack(request, { meta_error: (err as Error).message });
  }
}
