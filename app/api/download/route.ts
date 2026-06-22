import { NextResponse } from "next/server.js";
import { downloadSchema } from "../../../lib/schema.ts";
import { processLead } from "../../../lib/integrations/index.ts";
import { checkRateLimit } from "../../../lib/rate-limit.ts";

export const runtime = "nodejs";

/** Lead-gate del brochure institucional. */
export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "download", 8);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Demasiados intentos. Esperá unos minutos." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  if (parsed.data.website) return NextResponse.json({ ok: true, url: "" });

  const { persisted } = await processLead({
    empresa: parsed.data.empresa || "Descarga web",
    nombre: "Descarga de recurso",
    email: parsed.data.email,
    telefono: "",
    tipoConsulta: "asesoramiento",
    mensaje: "Solicitó el brochure institucional",
    agendarReunion: false,
  });

  if (!persisted) {
    return NextResponse.json(
      { ok: false, error: "No pudimos registrar la descarga. Intentá nuevamente." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    url: process.env.DRIVE_BROCHURE_URL || "/brochure.pdf",
  });
}