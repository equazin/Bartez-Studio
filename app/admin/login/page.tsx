import { redirect } from "next/navigation";
import { getAdminSession } from "../../../lib/auth";
import { LoginForm } from "./LoginForm";

export default async function AdminLogin() {
  const session = await getAdminSession();
  if (session) redirect("/admin");
  return <LoginForm />;
}
