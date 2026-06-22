import { NextResponse } from "next/server.js";
import { leadSchema } from "../../../lib/schema.ts";
import { processLead } from "../../../lib/integrations/index.ts";
import { checkRateLimit } from "../../../lib/rate-limit.ts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const rateLimit = checkRateLimit(req, "lead", 5);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Demasiados intentos. Esperá unos minutos." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // Honeypot: si "website" viene con contenido, es bot → respondemos OK silencioso.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { persisted } = await processLead(parsed.data);

  if (!persisted) {
    return NextResponse.json(
      { ok: false, error: "No pudimos registrar tu consulta. Escribinos por WhatsApp." },
      { status: 503 }
    );
  }

  // El lead siempre se considera recibido (persistido vía log + integraciones).
  return NextResponse.json({ ok: true });
}
