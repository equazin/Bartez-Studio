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
    <main className="grid min-h-screen bg-[#f7f8f5] lg:grid-cols-[1fr_.78fr]">
      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[430px]">
          <Image src="/brand/bartez-logo.png" alt="Bartez Tecnología" width={180} height={54} className="h-10 w-auto" priority />
          <div className="mt-14">
            <h1 className="font-display text-[clamp(34px,5vw,46px)] font-bold tracking-[-0.04em] text-ink">Acceso al panel</h1>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-slate-600">Gestioná artículos, logos y casos publicados en el sitio institucional.</p>
          </div>

          <form onSubmit={submit} className="mt-9 flex flex-col gap-5">
            {error ? <AdminAlert>{error}</AdminAlert> : null}
            <AdminField label="Usuario" htmlFor="admin-username">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <AdminInput id="admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="pl-10" required />
              </div>
            </AdminField>
            <AdminField label="Contraseña" htmlFor="admin-password">
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <AdminInput id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="pl-10" required />
              </div>
            </AdminField>
            <AdminButton type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? "Verificando…" : "Ingresar"} <ArrowRight />
            </AdminButton>
          </form>

          <Link href="/" className="mt-8 inline-flex text-[13px] font-semibold text-slate-500 hover:text-brand">← Volver al sitio</Link>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-[#073b2a] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
        <ShieldCheck className="size-9 text-emerald" strokeWidth={1.5} />
        <div>
          <p className="max-w-[14ch] font-display text-[42px] font-bold leading-[1.08] tracking-[-0.045em]">Contenido institucional, bajo control.</p>
          <p className="mt-6 max-w-[42ch] text-[14px] leading-relaxed text-emerald-50/70">Sesiones protegidas, cambios validados y publicación coordinada con el sitio público.</p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.13em] text-emerald-100/45">Bartez Tecnología · Administración</p>
      </aside>
    </main>
  );
}
