import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyToken } from "./auth-token.ts";

export { ADMIN_COOKIE_NAME, signToken, tokenFromCookieHeader, verifyToken } from "./auth-token.ts";
export type { AdminSession } from "./auth-token.ts";

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}
