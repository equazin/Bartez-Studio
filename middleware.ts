import { NextResponse } from "next/server.js";
import type { NextRequest } from "next/server.js";
import { ADMIN_COOKIE_NAME, verifyToken } from "./lib/auth-token.ts";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";
  if (!isPage && !isApi) return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (token && await verifyToken(token)) return NextResponse.next();

  if (isApi) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
