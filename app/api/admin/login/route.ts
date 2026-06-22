import { NextResponse } from "next/server";
import { signToken } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const { username, password } = body;

  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      { ok: false, error: "El panel de administración no está configurado (falta ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  if (username === expectedUsername && password === expectedPassword) {
    const token = await signToken({ username });

    const response = NextResponse.json({ ok: true });
    
    // Configura la cookie httpOnly para la sesión
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 6 * 60 * 60, // 6 horas
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ ok: false, error: "Usuario o contraseña incorrectos" }, { status: 401 });
}
