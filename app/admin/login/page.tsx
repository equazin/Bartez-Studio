"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle, Loader } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Credenciales incorrectas");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#050F0A] px-6 py-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -left-1/4 -top-1/4 h-[70vw] w-[70vw] rounded-full bg-ink/30 blur-[120px] pointer-events-none" />
      <div className="absolute -right-1/4 -bottom-1/4 h-[70vw] w-[70vw] rounded-full bg-brand/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Brand header */}
        <div className="text-center mb-9">
          <span className="font-display text-[26px] font-bold tracking-tight text-white">
            BARTEZ <span className="text-bronce">TECNOLOGÍA</span>
          </span>
          <p className="mt-2 text-[14.5px] text-slate-400">
            Panel de control de contenidos institucionales
          </p>
        </div>

        {/* Card wrapper */}
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0C2014] p-8 shadow-card">
          <h1 className="text-[19px] font-semibold text-white mb-6">Iniciar sesión</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-[14px] text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[13.5px] font-medium text-slate-300">Usuario</label>
              <div className="relative">
                <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] py-3 pl-11 pr-4 text-[14.5px] text-white outline-none placeholder:text-slate-600 focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13.5px] font-medium text-slate-300">Contraseña</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] py-3 pl-11 pr-4 text-[14.5px] text-white outline-none placeholder:text-slate-600 focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative flex w-full items-center justify-center rounded-xl bg-accent py-3.5 text-center text-[15px] font-semibold text-[#050F0A] hover:bg-sky focus:outline-none disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader size={18} className="animate-spin text-[#050F0A]" />
              ) : (
                "Acceder al Panel"
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-[13px] text-slate-500 hover:text-slate-300 transition-colors">
            ← Volver al sitio público
          </a>
        </div>
      </div>
    </main>
  );
}
