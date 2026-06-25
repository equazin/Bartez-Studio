"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput } from "../../../components/admin/AdminUI";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No pudimos iniciar sesión.");
      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      setError((loginError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1fr_.72fr]">
      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[430px]">
          <Image src="/brand/bartez-logo.png" alt="Bartez Tecnología" width={180} height={54} className="h-10 w-auto" priority />
          <div className="mt-12">
            <h1 className="font-display text-[clamp(32px,4vw,42px)] font-bold tracking-[-0.04em] text-slate-950">Acceso al panel</h1>
            <p className="mt-3 max-w-[42ch] text-[15px] font-medium leading-relaxed text-slate-700">CRM, analytics, contenido y comunicación en un solo lugar.</p>
          </div>

          <form onSubmit={submit} className="mt-9 flex flex-col gap-5">
            {error ? <AdminAlert>{error}</AdminAlert> : null}
            <AdminField label="Usuario" htmlFor="admin-username">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
                <AdminInput id="admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="pl-10" required />
              </div>
            </AdminField>
            <AdminField label="Contraseña" htmlFor="admin-password">
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
                <AdminInput id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="pl-10" required />
              </div>
            </AdminField>
            <AdminButton type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? "Verificando…" : "Ingresar"} <ArrowRight />
            </AdminButton>
          </form>

          <Link href="/" className="mt-8 inline-flex text-[13px] font-bold text-slate-700 hover:text-brand">← Volver al sitio</Link>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden border-l border-white/[0.06] bg-[#070a16] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <ShieldCheck className="size-9 text-sky" strokeWidth={1.5} />
        <div>
          <p className="max-w-[14ch] font-display text-[40px] font-bold leading-[1.08] tracking-[-0.045em]">Sistema interno Bartez.</p>
          <p className="mt-6 max-w-[42ch] text-[14px] font-medium leading-relaxed text-slate-300">CRM, analytics, contenido y comunicación. Todo desde un solo lugar.</p>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-500">Bartez Tecnología · Sistema interno</p>
      </aside>
    </main>
  );
}
