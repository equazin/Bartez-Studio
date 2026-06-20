import { NextResponse } from "next/server";
import { leadSchema } from "../../../lib/schema";
import { processLead } from "../../../lib/integrations";

export const runtime = "nodejs";

export async function POST(req: Request) {
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

  const { results } = await processLead(parsed.data);

  // El lead siempre se considera recibido (persistido vía log + integraciones).
  return NextResponse.json({ ok: true, results });
}
