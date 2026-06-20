import { NextResponse } from "next/server";
import { downloadSchema } from "../../../lib/schema";
import { processLead } from "../../../lib/integrations";

export const runtime = "nodejs";

/**
 * Lead-gate de descargas: registra el lead (email) y devuelve el link del PDF
 * (hospedado en Google Drive). Los links se configuran por env:
 *  - DRIVE_BROCHURE_URL
 *  - DRIVE_CATALOGO_URL
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, url: "" });
  }

  const { email, empresa, resource } = parsed.data;

  // Registramos como lead de descarga (reutiliza el orquestador).
  await processLead({
    empresa: empresa || "Descarga web",
    nombre: "Descarga de recurso",
    email,
    telefono: "",
    tipoConsulta: "asesoramiento",
    mensaje: `Solicitó descarga: ${resource}`,
    agendarReunion: false,
  });

  // Prioridad: link de Drive (env) → PDF servido desde /public como fallback.
  const url =
    resource === "brochure"
      ? process.env.DRIVE_BROCHURE_URL || "/brochure.pdf"
      : process.env.DRIVE_CATALOGO_URL || "/catalogo.pdf";

  return NextResponse.json({ ok: true, url });
}
