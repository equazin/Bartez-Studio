"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Facebook, Instagram, Link2, Loader2, Pause, Pencil, Play, Plug, Plus, RefreshCw, Save, Send, Target, Trash2, XCircle } from "lucide-react";
import { AdminAlert, AdminButton, AdminInput, AdminPanel, AdminSpinner, ConfirmDialog } from "../../../../components/admin/AdminUI";
import { Composer, type ComposerAccount } from "../../../../components/admin/marketing/Composer";
import { Calendar } from "../../../../components/admin/marketing/Calendar";

type Provider = "facebook" | "instagram";
type PostStatus = "draft" | "scheduled" | "publishing" | "published" | "failed" | "canceled";

interface SocialAccount {
  id: string;
  provider: Provider;
  name: string;
  avatarUrl: string | null;
  tokenExpiresAt: string | null;
  connectedAt: string;
}

interface SocialPost {
  id: string;
  socialAccountId: string;
  accountName: string;
  accountProvider: Provider;
  kind: string;
  caption: string;
  mediaUrls: string[];
  linkUrl: string | null;
  status: PostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  permalink: string | null;
  error: string | null;
  insights: Record<string, number> | null;
}

const TABS = [
  { id: "compose", label: "Publicar" },
  { id: "calendar", label: "Calendario" },
  { id: "scheduled", label: "Programados" },
  { id: "history", label: "Historial" },
  { id: "accounts", label: "Cuentas" },
  { id: "google_ads", label: "Google Ads" },
] as const;
type TabId = (typeof TABS)[number]["id"];

interface GoogleAdsCampaign {
  id: string;
  resourceName: string;
  name: string;
  status: "ENABLED" | "PAUSED" | "REMOVED" | "UNSPECIFIED";
  dailyBudget: number | null;
  budgetResourceName: string | null;
  spendLast7d: number;
  advertisingChannelType: string | null;
}

function providerIcon(provider: Provider) {
  return provider === "instagram" ? Instagram : Facebook;
}

function providerLabel(provider: Provider): string {
  return provider === "instagram" ? "Instagram" : "Facebook";
}

function statusBadge(status: PostStatus): { label: string; className: string } {
  switch (status) {
    case "scheduled": return { label: "Programado", className: "border-blue-200 bg-blue-50 text-blue-800" };
    case "publishing": return { label: "Publicando…", className: "border-amber-200 bg-amber-50 text-amber-800" };
    case "published": return { label: "Publicado", className: "border-emerald-200 bg-emerald-50 text-emerald-800" };
    case "failed": return { label: "Falló", className: "border-red-200 bg-red-50 text-red-800" };
    case "canceled": return { label: "Cancelado", className: "border-slate-200 bg-slate-50 text-slate-700" };
    default: return { label: "Borrador", className: "border-slate-200 bg-slate-50 text-slate-700" };
  }
}

export default function MarketingPage() {
  const [tab, setTab] = useState<TabId>("compose");
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [appConfigured, setAppConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState<SocialAccount | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [accRes, postRes] = await Promise.all([
        fetch("/api/admin/marketing/accounts", { cache: "no-store" }),
        fetch("/api/admin/marketing/posts", { cache: "no-store" }),
      ]);
      const accData = await accRes.json();
      const postData = await postRes.json();
      if (!accRes.ok || !accData.ok) throw new Error(accData.error || "No pudimos cargar cuentas.");
      if (!postRes.ok || !postData.ok) throw new Error(postData.error || "No pudimos cargar posts.");
      setAccounts(accData.accounts);
      setAppConfigured(Boolean(accData.appConfigured));
      setPosts(postData.posts);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAll(); }, [loadAll]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("meta_connected")) {
      setNotice(`Se conectaron ${params.get("meta_connected")} cuentas de Meta.`);
      window.history.replaceState({}, "", "/admin/marketing");
    } else if (params.get("meta_error")) {
      setError(`Meta OAuth: ${params.get("meta_error")}`);
      window.history.replaceState({}, "", "/admin/marketing");
    }
  }, []);

  async function connectMeta() {
    setConnecting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/marketing/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect_meta" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "No pudimos generar la URL de OAuth.");
      window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message);
      setConnecting(false);
    }
  }

  async function disconnect(account: SocialAccount) {
    const res = await fetch(`/api/admin/marketing/accounts/${account.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.ok) { setError(data.error || "No pudimos desconectar."); return; }
    setDisconnectTarget(null);
    await loadAll();
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Marketing / Redes</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">
            Publicá en Facebook e Instagram desde un solo lugar y programá contenido.
          </p>
        </div>
        <AdminButton variant="secondary" onClick={() => void loadAll()}><RefreshCw />Refrescar</AdminButton>
      </div>

      {!appConfigured ? (
        <div className="mt-5">
          <AdminAlert tone="error">
            Faltan credenciales de la Meta App: definí META_APP_ID, META_APP_SECRET y META_APP_REDIRECT_URI (o cargalas en configuración/credenciales) para habilitar la conexión OAuth.
          </AdminAlert>
        </div>
      ) : null}
      {error ? <div className="mt-5"><AdminAlert>{error}</AdminAlert></div> : null}
      {notice ? <div className="mt-5"><AdminAlert tone="success">{notice}</AdminAlert></div> : null}

      <div className="mt-6 flex gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-3 py-2 text-[13px] font-bold transition-colors ${
              tab === t.id ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {loading ? (
          <AdminPanel className="grid min-h-56 place-items-center"><AdminSpinner label="Cargando…" /></AdminPanel>
        ) : tab === "compose" ? (
          accounts.length === 0 ? (
            <AdminPanel className="p-8 text-center">
              <Plug className="mx-auto size-9 text-slate-400" />
              <p className="mt-4 text-[14px] font-bold text-slate-950">Todavía no hay cuentas conectadas.</p>
              <p className="mt-1 text-[13px] text-slate-600">Andá a la pestaña &quot;Cuentas&quot; y conectá Meta.</p>
            </AdminPanel>
          ) : (
            <Composer accounts={accounts as ComposerAccount[]} onSaved={() => void loadAll()} />
          )
        ) : tab === "calendar" ? (
          <Calendar posts={posts} />
        ) : tab === "scheduled" ? (
          <PostList posts={posts.filter((p) => p.status === "scheduled" || p.status === "draft")} emptyLabel="No hay posts programados." onChanged={() => void loadAll()} />
        ) : tab === "history" ? (
          <PostList posts={posts.filter((p) => ["published", "failed", "canceled"].includes(p.status))} emptyLabel="Todavía no hay historial." onChanged={() => void loadAll()} showInsights />
        ) : tab === "accounts" ? (
          <AccountsTab accounts={accounts} onConnect={connectMeta} connecting={connecting} onDisconnect={setDisconnectTarget} disabled={!appConfigured} />
        ) : (
          <GoogleAdsTab />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(disconnectTarget)}
        onOpenChange={(open) => !open && setDisconnectTarget(null)}
        title="Desconectar cuenta"
        description="Los posts publicados quedan en el historial. Los programados no podrán publicarse hasta reconectar."
        onConfirm={() => disconnectTarget ? void disconnect(disconnectTarget) : undefined}
      />
    </div>
  );
}

function AccountsTab({ accounts, onConnect, connecting, onDisconnect, disabled }: {
  accounts: SocialAccount[];
  onConnect: () => void;
  connecting: boolean;
  onDisconnect: (a: SocialAccount) => void;
  disabled: boolean;
}) {
  const [now, setNow] = useState(0);
  useEffect(() => { setNow(Date.now()); }, []);
  return (
    <div className="flex flex-col gap-5">
      <AdminPanel className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-[18px] font-bold text-slate-950">Meta (Facebook + Instagram)</h2>
          <p className="mt-1 text-[13px] text-slate-600">Conectá una cuenta empresarial. Se traen todas las páginas gestionadas y sus IG business asociados.</p>
        </div>
        <AdminButton onClick={onConnect} disabled={connecting || disabled}>
          {connecting ? <><Loader2 className="animate-spin" />Redirigiendo…</> : <><Plug />Conectar Meta</>}
        </AdminButton>
      </AdminPanel>

      {accounts.length === 0 ? (
        <AdminPanel className="p-8 text-center text-slate-600">Sin cuentas conectadas.</AdminPanel>
      ) : (
        <AdminPanel className="overflow-hidden">
          {accounts.map((a) => {
            const Icon = providerIcon(a.provider);
            const expires = a.tokenExpiresAt ? new Date(a.tokenExpiresAt) : null;
            const soon = expires && now ? expires.getTime() - now < 7 * 86_400_000 : false;
            return (
              <div key={a.id} className="flex items-center gap-4 border-b border-slate-200 px-5 py-4 last:border-0">
                <span className="grid size-10 flex-none place-items-center rounded-full border border-slate-300 bg-white text-slate-700">
                  <Icon className="size-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[14px] font-bold text-slate-950">{a.name}</p>
                  <p className="mt-0.5 text-[12px] text-slate-600">
                    {providerLabel(a.provider)} · Conectada el {new Date(a.connectedAt).toLocaleDateString("es-AR")}
                    {expires ? ` · Token vence ${expires.toLocaleDateString("es-AR")}` : ""}
                  </p>
                  {soon ? <p className="mt-1 text-[11.5px] font-bold text-amber-700">El token vence pronto — reconectar.</p> : null}
                </div>
                <AdminButton variant="ghost" size="icon" onClick={() => onDisconnect(a)} aria-label="Desconectar"><Trash2 /></AdminButton>
              </div>
            );
          })}
        </AdminPanel>
      )}
    </div>
  );
}

function PostList({ posts, emptyLabel, onChanged, showInsights }: {
  posts: SocialPost[];
  emptyLabel: string;
  onChanged: () => void;
  showInsights?: boolean;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function act(id: string, kind: "publish" | "cancel") {
    setBusy(id);
    try {
      const url = kind === "publish" ? `/api/admin/marketing/posts/${id}/publish` : `/api/admin/marketing/posts/${id}`;
      const method = kind === "publish" ? "POST" : "DELETE";
      const res = await fetch(url, { method });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Error");
      onChanged();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  if (posts.length === 0) {
    return <AdminPanel className="p-8 text-center text-slate-600">{emptyLabel}</AdminPanel>;
  }

  return (
    <AdminPanel className="overflow-hidden">
      {posts.map((p) => {
        const badge = statusBadge(p.status);
        const Icon = providerIcon(p.accountProvider);
        return (
          <div key={p.id} className="border-b border-slate-200 px-5 py-4 last:border-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${badge.className}`}>
                    {p.status === "published" ? <CheckCircle2 className="size-3" /> : p.status === "failed" ? <XCircle className="size-3" /> : null}
                    {badge.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold text-slate-700">
                    <Icon className="size-3.5" />
                    {p.accountName}
                  </span>
                  {p.scheduledAt ? <span className="text-[12px] text-slate-500">· programado {new Date(p.scheduledAt).toLocaleString("es-AR")}</span> : null}
                  {p.publishedAt ? <span className="text-[12px] text-slate-500">· publicado {new Date(p.publishedAt).toLocaleString("es-AR")}</span> : null}
                </div>
                <p className="mt-2 line-clamp-3 text-[13.5px] text-slate-800 whitespace-pre-wrap">{p.caption || "(sin texto)"}</p>
                {p.mediaUrls.length > 0 ? (
                  <p className="mt-1 text-[11.5px] text-slate-500">{p.mediaUrls.length} archivo(s) adjunto(s)</p>
                ) : null}
                {p.error ? <p className="mt-2 text-[12px] font-bold text-red-700">Error: {p.error}</p> : null}
                {showInsights && p.insights ? (
                  <div className="mt-2 flex flex-wrap gap-3 text-[11.5px] text-slate-700">
                    {Object.entries(p.insights).map(([k, v]) => (
                      <span key={k} className="rounded bg-slate-100 px-2 py-0.5"><strong>{k}:</strong> {v.toLocaleString("es-AR")}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-none flex-col gap-2 sm:w-40">
                {p.permalink ? (
                  <AdminButton asChild variant="secondary" size="sm">
                    <a href={p.permalink} target="_blank" rel="noreferrer"><ExternalLink />Ver</a>
                  </AdminButton>
                ) : null}
                {(p.status === "scheduled" || p.status === "draft" || p.status === "failed") ? (
                  <>
                    <AdminButton size="sm" onClick={() => void act(p.id, "publish")} disabled={busy === p.id}>
                      {busy === p.id ? <Loader2 className="animate-spin" /> : <Send />}
                      Publicar ahora
                    </AdminButton>
                    <AdminButton variant="ghost" size="sm" onClick={() => void act(p.id, "cancel")} disabled={busy === p.id}>
                      <Trash2 />Cancelar
                    </AdminButton>
                  </>
                ) : null}
                {p.linkUrl ? (
                  <a className="inline-flex items-center gap-1 text-[11.5px] text-slate-500" href={p.linkUrl} target="_blank" rel="noreferrer">
                    <Link2 className="size-3" />{new URL(p.linkUrl).host}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </AdminPanel>
  );
}

function GoogleAdsTab() {
  const [state, setState] = useState<{ configured: boolean; campaigns: GoogleAdsCampaign[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<{ resource: string; value: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/marketing/google-ads/campaigns", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "No pudimos traer campañas.");
      setState({ configured: Boolean(data.configured), campaigns: data.campaigns ?? [] });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function toggleStatus(campaign: GoogleAdsCampaign) {
    const next = campaign.status === "ENABLED" ? "PAUSED" : "ENABLED";
    setBusyId(campaign.id);
    try {
      const res = await fetch(`/api/admin/marketing/google-ads/campaigns/${campaign.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "No pudimos actualizar el estado.");
      await load();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  async function saveBudget(campaign: GoogleAdsCampaign) {
    if (!editingBudget || !campaign.budgetResourceName) return;
    const amount = Number(editingBudget.value.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) { alert("Budget inválido"); return; }
    setBusyId(campaign.id);
    try {
      const res = await fetch("/api/admin/marketing/google-ads/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgetResourceName: campaign.budgetResourceName, dailyAmount: amount }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "No pudimos actualizar el budget.");
      setEditingBudget(null);
      await load();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <AdminPanel className="grid min-h-56 place-items-center"><AdminSpinner label="Cargando campañas…" /></AdminPanel>;
  if (error) return <AdminAlert>{error}</AdminAlert>;
  if (!state) return null;
  if (!state.configured) {
    return (
      <AdminPanel className="p-8 text-center">
        <Target className="mx-auto size-9 text-slate-400" />
        <p className="mt-4 text-[14px] font-bold text-slate-950">Google Ads no está configurado.</p>
        <p className="mt-1 text-[13px] text-slate-600">Cargá GOOGLE_ADS_DEVELOPER_TOKEN, CLIENT_ID/SECRET, REFRESH_TOKEN y CUSTOMER_ID en credenciales.</p>
      </AdminPanel>
    );
  }
  if (state.campaigns.length === 0) {
    return <AdminPanel className="p-8 text-center text-slate-600">No hay campañas activas en la cuenta.</AdminPanel>;
  }

  return (
    <AdminPanel className="overflow-hidden">
      <div className="border-b border-slate-300 bg-slate-100 px-5 py-3 text-[12px] font-semibold text-slate-700">
        {state.campaigns.length} campañas — spend de los últimos 7 días
      </div>
      {state.campaigns.map((c) => {
        const enabled = c.status === "ENABLED";
        const isEditing = editingBudget?.resource === c.budgetResourceName;
        return (
          <div key={c.id} className="grid gap-3 border-b border-slate-200 px-5 py-4 last:border-0 sm:grid-cols-[minmax(0,1fr)_180px_200px_140px] sm:items-center">
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-bold text-slate-950">{c.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                {c.id} · {c.advertisingChannelType ?? "—"}
              </p>
            </div>
            <div className="text-[12.5px]">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${enabled ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                {enabled ? "ACTIVA" : c.status}
              </span>
              <span className="ml-2 text-slate-600">Spend 7d: ${c.spendLast7d.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <AdminInput
                    type="number"
                    step="0.01"
                    min={1}
                    value={editingBudget.value}
                    onChange={(e) => setEditingBudget({ ...editingBudget, value: e.target.value })}
                    className="h-8 w-24"
                  />
                  <AdminButton size="sm" onClick={() => void saveBudget(c)} disabled={busyId === c.id}><Save />Guardar</AdminButton>
                  <AdminButton variant="ghost" size="sm" onClick={() => setEditingBudget(null)}>Cancelar</AdminButton>
                </>
              ) : (
                <>
                  <span className="text-[13px] font-bold text-slate-950">
                    {c.dailyBudget != null ? `$${c.dailyBudget.toLocaleString("es-AR", { maximumFractionDigits: 2 })}/día` : "—"}
                  </span>
                  {c.budgetResourceName ? (
                    <AdminButton variant="ghost" size="icon" onClick={() => setEditingBudget({ resource: c.budgetResourceName!, value: String(c.dailyBudget ?? "") })} aria-label="Editar budget">
                      <Pencil />
                    </AdminButton>
                  ) : null}
                </>
              )}
            </div>
            <div className="flex justify-end">
              <AdminButton
                variant={enabled ? "secondary" : "primary"}
                size="sm"
                onClick={() => void toggleStatus(c)}
                disabled={busyId === c.id}
              >
                {busyId === c.id ? <Loader2 className="animate-spin" /> : enabled ? <Pause /> : <Play />}
                {enabled ? "Pausar" : "Activar"}
              </AdminButton>
            </div>
          </div>
        );
      })}
    </AdminPanel>
  );
}
