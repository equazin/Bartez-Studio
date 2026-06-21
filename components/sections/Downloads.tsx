"use client";

import { useState } from "react";
import { Download, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { downloads } from "../../constants";

export function Downloads() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-[1200px] px-7">
        <div className="mb-10 max-w-[640px]">
          <h2 className="font-display text-[clamp(26px,3.2vw,38px)] font-bold leading-tight text-ink">{downloads.title}</h2>
          <p className="mt-3 text-[16px] text-slate-600">{downloads.desc}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {downloads.items.map((it) => (
            <DownloadCard key={it.id} id={it.id} title={it.title} desc={it.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadCard({ id, title, desc }: { id: string; title: string; desc: string }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [url, setUrl] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resource: id, website }),
      });
      const data = await res.json();
      setUrl(data?.url || "");
      setState("done");
      if (data?.url) window.open(data.url, "_blank", "noopener");
    } catch {
      setState("idle");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-soft">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-brand/10 text-brand">
          <FileText className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-[18px] font-bold text-ink">{title}</h3>
          <p className="text-[14px] text-slate-600">{desc}</p>
        </div>
      </div>

      {state === "done" ? (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald/10 px-4 py-3 text-[14px] font-medium text-green-700">
          <CheckCircle2 size={18} />
          {url ? (
            <span>Listo. Si no se abrió, <a href={url} target="_blank" rel="noopener" className="underline">descargá acá</a>.</span>
          ) : (
            <span>¡Gracias! Te enviamos el material por mail.</span>
          )}
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <input type="text" tabIndex={-1} value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email corporativo"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[14.5px] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
          />
          <button type="submit" disabled={state === "loading"} className="flex flex-none items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-brand-bright disabled:opacity-70">
            {state === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Descargar
          </button>
        </form>
      )}
    </div>
  );
}
