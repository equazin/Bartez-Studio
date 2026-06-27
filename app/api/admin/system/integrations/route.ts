import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { getIntegrationsStatus } from "../../../../../lib/modules/system/integrations-service.ts";
import { isEncryptionConfigured } from "../../../../../lib/crypto/secrets.ts";
import { INTEGRATION_CATEGORIES } from "../../../../../lib/modules/system/integrations-catalog.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "sistema:credentials:manage");
  if (!auth.ok) return auth.response;
  try {
    const integrations = await getIntegrationsStatus(auth.orgId);
    return adminOk({ data: {
      integrations,
      categories: INTEGRATION_CATEGORIES,
      encryptionConfigured: isEncryptionConfigured(),
    } });
  } catch (error) {
    return adminServerError("system.integrations.list", error);
  }
}
