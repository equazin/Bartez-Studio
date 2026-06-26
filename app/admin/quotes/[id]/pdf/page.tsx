import { redirect } from "next/navigation.js";
import { getAdminSession } from "../../../../../lib/auth.ts";
import { getDb } from "../../../../../lib/db.ts";
import { resolveOrgId } from "../../../../../lib/tenant.ts";
import { QuotePdfView } from "./QuotePdfView";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Vista print-friendly del presupuesto. Pensada para "Imprimir → Guardar como PDF"
 * desde el navegador. No usa el AdminShell — render limpio sobre fondo blanco.
 * Requiere sesión admin activa.
 */
export default async function QuotePdfPage({ params }: PageProps) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const orgId = await resolveOrgId(session);
  const quote = await getDb().quote.findFirst({
    where: { id, organizationId: orgId, deletedAt: null },
    include: {
      account: true,
      owner: { select: { id: true, name: true, email: true } },
      lines: { orderBy: { position: "asc" }, include: { product: { select: { id: true, sku: true, name: true, unit: true } } } },
    },
  });

  if (!quote) {
    return (
      <div className="mx-auto max-w-3xl p-12 text-center">
        <p className="text-lg font-bold text-slate-900">Presupuesto no encontrado.</p>
      </div>
    );
  }

  return <QuotePdfView quote={quote} />;
}
