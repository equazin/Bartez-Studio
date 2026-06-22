import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "default-jwt-secret-should-be-changed-in-prod-12345678"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren protección
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get("admin_session")?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        isAuthenticated = true;
      } catch (err) {
        // Token inválido o expirado
      }
    }

    if (!isAuthenticated) {
      if (isAdminApi) {
        return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
      } else {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
