"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building2, CheckCircle2, ExternalLink, Hash, Plug, Save, Settings, ShieldCheck, Trash2, Wrench, X } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPanel, AdminSpinner, AdminTextarea } from "../../../../components/admin/AdminUI";

type Tab = "empresa" | "integraciones" | "numeracion" | "salud";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "empresa", label: "Empresa", icon: Building2 },
  { key: "integraciones", label: "Integraciones", icon: Plug },
  { key: "numeracion", label: "Numeración", icon: Hash },
  { key: "salud", label: "Salud del sistema", icon: Wrench },
];

interface IntegrationField {
  key: string;
  label: string;
  hint?: string;
  secret?: boolean;
  multiline?: boolean;
  required?: boolean;
  source: "bd" | "env" | null;
  preview: string | null;
}

interface Integration {
  id: string;
  label: string;
  description: string;
  category: string;
  docsUrl?: string;
  standby?: boolean;
  configured: boolean;
  readerMigrated: boolean;
  fields: IntegrationField[];
}

interface Category { id: string; label: string; }

interface OrgSettings {
  taxCondition: string;
  fiscalAddress: string;
  pointOfSale: number;
  purchaseApprovalThreshold: number;
  alertsWhatsappTo: string;
  alertsEmailTo: string;
}

interface HealthData {
  database: { ok: boolean; latencyMs: number; migrationsApplied: number; lastMigrationName: string | null; lastMigrationAt: string | null };
  runtime: { node: string; env: string; region: string; commit: string | null; commitBranch: string | null; deployedAt: string | null };
  encryption: { configured: boolean };
}

interface Sequence { id: string; docType: string; pointOfSale: number; nextNumber: number; }

const DOC_TYPE_LABELS: Record<string, string> = {
  presupuesto: "Presupuesto",
  pedido: "Pedido",
  factura_a: "Factura A",
  factura_b: "Factura B",
  factura_c: "Factura C",
  nota_credito: "Nota de crédito",
  nota_debito: "Nota de débito",
  remito: "Remito",
  recibo: "Recibo",
  orden_compra: "Orden de compra",
  recepcion_compra: "Recepción de compra",
  pago_proveedor: "Pago a proveedor",
  movimiento_caja: "Movimiento caja",
  asiento: "Asiento contable",
};

export default function SystemPage() {
  const [tab, setTab] = useState<Tab>("empresa");

  return (
    <div className="mx-auto max-w-[1100px]">
      <header>
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-slate-500">Sistema</p>
        <h1 className="mt-1 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">Configuración</h1>
        <p className="mt-1.5 text-[13.5px] font-medium text-slate-600">Datos de la empresa, integraciones, numeración y salud del sistema. Solo el owner puede modificar.</p>
      </header>

      <nav className="mt-6 flex flex-wrap gap-1.5 border-b border-slate-200">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${tab === key ? "border-brand text-brand" : "border-transparent text-slate-600 hover:text-slate-900"}`}
          >
            <Icon className="size-4" strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "empresa" && <EmpresaTab />}
        {tab === "integraciones" && <IntegracionesTab />}
        {tab === "numeracion" && <NumeracionTab />}
        {tab === "salud" && <SaludTab />}
      </div>
    </div>
  );
}

/* ──────────────────────────── EMPRESA ──────────────────────────── */

function EmpresaTab() {
  const [data, setData] = useState<OrgSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((j) => {
      if (j.ok) setData(j.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function save() {
    if (!data) return;
    setSaving(true); setError(null); setOk(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taxCondition: data.taxCondition,
          fiscalAddress: data.fiscalAddress,
          pointOfSale: data.pointOfSale,
        }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Error al guardar");
      setOk("Datos de la empresa actualizados.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setSaving(false); }
  }

  if (loading) return <div className="flex justify-center py-16"><AdminSpinner /></div>;
  if (!data) return <AdminAlert tone="error">No pudimos cargar la configuración.</AdminAlert>;

  return (
    <div className="space-y-4">
      {error && <AdminAlert tone="error">{error}</AdminAlert>}
      {ok && <AdminAlert tone="success">{ok}</AdminAlert>}
      <AdminPanel className="p-5">
        <h2 className="font-display text-[16px] font-bold text-slate-950">Datos fiscales y operativos</h2>
        <p className="mt-1 text-[12.5px] text-slate-600">Aparecen en facturas, pedidos y reportes. La razón social y CUIT se editan más arriba en el modelo Organization (no hay aún UI para eso).</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminField label="Condición frente a IVA" htmlFor="tax-cond">
            <select id="tax-cond" value={data.taxCondition} onChange={(e) => setData({ ...data, taxCondition: e.target.value })} className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] font-medium text-slate-950">
              <option value="">— Seleccionar —</option>
              <option value="responsable_inscripto">Responsable inscripto</option>
              <option value="monotributo">Monotributo</option>
              <option value="exento">Exento</option>
              <option value="consumidor_final">Consumidor final</option>
            </select>
          </AdminField>
          <AdminField label="Punto de venta AFIP default" htmlFor="pos">
            <AdminInput id="pos" type="number" min="1" max="99999" value={data.pointOfSale} onChange={(e) => setData({ ...data, pointOfSale: Number(e.target.value) || 1 })} />
          </AdminField>
        </div>
        <div className="mt-4">
          <AdminField label="Domicilio fiscal" htmlFor="addr">
            <AdminInput id="addr" value={data.fiscalAddress} onChange={(e) => setData({ ...data, fiscalAddress: e.target.value })} placeholder="Calle, número, ciudad, provincia" />
          </AdminField>
        </div>
        <div className="mt-5 flex justify-end">
          <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
        </div>
      </AdminPanel>
    </div>
  );
}

/* ──────────────────────────── INTEGRACIONES ──────────────────────────── */

function IntegracionesTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [encryptionConfigured, setEncryptionConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/system/integrations");
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Error al cargar");
      setIntegrations(j.data.integrations);
      setCategories(j.data.categories);
      setEncryptionConfigured(j.data.encryptionConfigured);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const byCategory = useMemo(() => {
    const map = new Map<string, Integration[]>();
    for (const c of categories) map.set(c.id, []);
    for (const integ of integrations) {
      const list = map.get(integ.category) ?? [];
      list.push(integ);
      map.set(integ.category, list);
    }
    return map;
  }, [integrations, categories]);

  if (loading) return <div className="flex justify-center py-16"><AdminSpinner /></div>;

  return (
    <div className="space-y-5">
      {error && <AdminAlert tone="error">{error}</AdminAlert>}
      {!encryptionConfigured && (
        <AdminAlert tone="error">
          <span><b>CREDENTIAL_ENCRYPTION_KEY</b> no está configurada en Vercel. Sin esta variable no podés guardar credenciales desde la UI. Generala así: <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-[12px]">node -e &quot;console.log(require(&apos;crypto&apos;).randomBytes(32).toString(&apos;hex&apos;))&quot;</code> y agregala a Vercel.</span>
        </AdminAlert>
      )}

      {categories.map((cat) => {
        const list = byCategory.get(cat.id) ?? [];
        if (list.length === 0) return null;
        return (
          <section key={cat.id}>
            <h3 className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-slate-500">{cat.label}</h3>
            <div className="space-y-3">
              {list.map((integ) => (
                <IntegrationCard key={integ.id} integ={integ} onChange={load} disabled={!encryptionConfigured} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function IntegrationCard({ integ, onChange, disabled }: { integ: Integration; onChange: () => void; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function saveField(key: string) {
    const value = values[key]?.trim();
    if (!value) { setError(`Ingresá un valor para ${key}.`); return; }
    setSaving(key); setError(null); setOk(null);
    try {
      const res = await fetch(`/api/admin/system/integrations/${integ.id}/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Error al guardar");
      setOk(`Guardado: ${key}.`);
      setValues((v) => ({ ...v, [key]: "" }));
      onChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setSaving(null); }
  }

  async function clearField(key: string) {
    if (!confirm(`¿Eliminar el valor guardado de ${key}? (volverá a leer el env)`)) return;
    setSaving(key); setError(null);
    try {
      const res = await fetch(`/api/admin/system/integrations/${integ.id}/${key}`, { method: "DELETE" });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Error al borrar");
      onChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setSaving(null); }
  }

  const statusChip = integ.configured
    ? { label: "Conectado", className: "bg-emerald-50 text-emerald-700" }
    : integ.standby
      ? { label: "Standby", className: "bg-amber-50 text-amber-700" }
      : { label: "No configurado", className: "bg-slate-100 text-slate-600" };

  return (
    <AdminPanel className="overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50/60">
        <div className="flex items-center gap-3">
          <span className={`grid size-9 place-items-center rounded-lg ${integ.configured ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            <Plug className="size-[18px]" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[14px] font-bold text-slate-950">
              {integ.label}
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${statusChip.className}`}>{statusChip.label}</span>
              {!integ.readerMigrated && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-700" title="El reader del código aún lee del env. Cargar acá no aplica todavía.">
                  <AlertTriangle className="size-3" /> Aún desde env
                </span>
              )}
            </p>
            <p className="mt-0.5 text-[12.5px] text-slate-600">{integ.description}</p>
          </div>
        </div>
        <span className="text-[12px] font-semibold text-slate-500">{open ? "Cerrar" : "Configurar"}</span>
      </button>

      {open && (
        <div className="border-t border-slate-200 bg-slate-50/30 px-5 py-4">
          {integ.docsUrl && (
            <a href={integ.docsUrl} target="_blank" rel="noopener noreferrer" className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand hover:underline">
              <ExternalLink className="size-3.5" /> Documentación oficial
            </a>
          )}
          {error && <div className="mb-3"><AdminAlert tone="error">{error}</AdminAlert></div>}
          {ok && <div className="mb-3"><AdminAlert tone="success">{ok}</AdminAlert></div>}

          <div className="space-y-4">
            {integ.fields.map((f) => (
              <div key={f.key} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-slate-900">
                      {f.label}
                      {f.required && <span className="ml-1 text-red-600">*</span>}
                    </p>
                    {f.hint && <p className="mt-0.5 text-[11.5px] text-slate-600">{f.hint}</p>}
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-bold ${
                    f.source === "bd" ? "bg-emerald-50 text-emerald-700" : f.source === "env" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {f.source === "bd" ? <CheckCircle2 className="size-3" /> : f.source === "env" ? <ShieldCheck className="size-3" /> : <X className="size-3" />}
                    {f.source === "bd" ? "BD cifrada" : f.source === "env" ? "Vercel env" : "Sin valor"}
                  </span>
                </div>

                {f.preview && (
                  <p className="mt-2 font-mono text-[12px] text-slate-700">Actual: <span className="rounded bg-slate-100 px-1.5 py-0.5">{f.preview}</span></p>
                )}

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    {f.multiline ? (
                      <AdminTextarea
                        value={values[f.key] ?? ""}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                        placeholder={f.secret ? "Pegá el nuevo valor (no se mostrará)" : "Nuevo valor"}
                        rows={6}
                        autoComplete="off"
                      />
                    ) : (
                      <AdminInput
                        type={f.secret ? "password" : "text"}
                        value={values[f.key] ?? ""}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                        placeholder={f.secret ? "Nuevo valor (no se mostrará)" : "Nuevo valor"}
                        autoComplete="off"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <AdminButton size="sm" disabled={disabled || saving === f.key} onClick={() => void saveField(f.key)}>
                      <Save />{saving === f.key ? "..." : "Guardar"}
                    </AdminButton>
                    {f.source === "bd" && (
                      <AdminButton size="sm" variant="danger" disabled={saving === f.key} onClick={() => void clearField(f.key)}>
                        <Trash2 />Borrar
                      </AdminButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminPanel>
  );
}

/* ──────────────────────────── NUMERACIÓN ──────────────────────────── */

function NumeracionTab() {
  const [items, setItems] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/system/sequences");
      const j = await res.json();
      if (res.ok && j.ok) setItems(j.data || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save(seq: Sequence) {
    const nextNumber = editing[seq.id] ?? seq.nextNumber;
    if (nextNumber < 1) { setError("El próximo número debe ser >= 1"); return; }
    setSavingId(seq.id); setError(null); setOk(null);
    try {
      const res = await fetch("/api/admin/system/sequences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType: seq.docType, pointOfSale: seq.pointOfSale, nextNumber }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Error");
      setOk(`Actualizado: ${seq.docType}/${seq.pointOfSale} → ${nextNumber}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setSavingId(null); }
  }

  if (loading) return <div className="flex justify-center py-16"><AdminSpinner /></div>;

  return (
    <div className="space-y-4">
      {error && <AdminAlert tone="error">{error}</AdminAlert>}
      {ok && <AdminAlert tone="success">{ok}</AdminAlert>}
      <AdminPanel className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-display text-[16px] font-bold text-slate-950">Próximos números</h2>
          <p className="mt-1 text-[12.5px] text-slate-600">Editá solo si necesitás resetear o saltar (ej: migración desde otro sistema). Cambiar el próximo número de una factura puede romper la continuidad fiscal.</p>
        </div>
        {items.length === 0 ? (
          <div className="px-5 py-12 text-center text-[13px] text-slate-600">Las secuencias se crean al emitir el primer comprobante de cada tipo.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            <div className="hidden grid-cols-[1.4fr_.5fr_.7fr_auto] gap-3 bg-slate-50/60 px-5 py-2.5 text-[11.5px] font-semibold text-slate-600 lg:grid">
              <span>Tipo de documento</span><span>PV</span><span>Próximo número</span><span />
            </div>
            {items.map((seq) => (
              <div key={seq.id} className="grid gap-2 px-5 py-3.5 lg:grid-cols-[1.4fr_.5fr_.7fr_auto] lg:items-center lg:gap-3">
                <p className="text-[13.5px] font-semibold text-slate-950">{DOC_TYPE_LABELS[seq.docType] ?? seq.docType}<span className="ml-2 font-mono text-[11px] text-slate-500">{seq.docType}</span></p>
                <p className="font-mono text-[13px] text-slate-700">{String(seq.pointOfSale).padStart(4, "0")}</p>
                <AdminInput type="number" min="1" value={editing[seq.id] ?? seq.nextNumber} onChange={(e) => setEditing({ ...editing, [seq.id]: Number(e.target.value) || 1 })} className="h-9" />
                <AdminButton size="sm" onClick={() => void save(seq)} disabled={savingId === seq.id || (editing[seq.id] ?? seq.nextNumber) === seq.nextNumber}>{savingId === seq.id ? "..." : "Guardar"}</AdminButton>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}

/* ──────────────────────────── SALUD ──────────────────────────── */

function SaludTab() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/system/health").then((r) => r.json()).then((j) => {
      if (j.ok) setData(j.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><AdminSpinner /></div>;
  if (!data) return <AdminAlert tone="error">No pudimos obtener el estado del sistema.</AdminAlert>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AdminPanel className="p-5">
        <div className="flex items-center gap-2">
          <span className={`grid size-9 place-items-center rounded-lg ${data.database.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}><Settings className="size-4" /></span>
          <div>
            <h3 className="text-[14px] font-bold text-slate-950">Base de datos</h3>
            <p className="text-[11.5px] font-semibold text-slate-600">{data.database.ok ? `Conectada · ${data.database.latencyMs}ms` : "Sin conexión"}</p>
          </div>
        </div>
        <dl className="mt-4 space-y-2 text-[13px]">
          <div className="flex justify-between"><dt className="text-slate-600">Migraciones aplicadas</dt><dd className="font-semibold text-slate-950">{data.database.migrationsApplied}</dd></div>
          {data.database.lastMigrationName && (
            <div className="flex flex-col gap-0.5">
              <dt className="text-slate-600">Última migración</dt>
              <dd className="font-mono text-[12px] text-slate-700">{data.database.lastMigrationName}</dd>
              {data.database.lastMigrationAt && <dd className="text-[11px] text-slate-500">{new Date(data.database.lastMigrationAt).toLocaleString("es-AR")}</dd>}
            </div>
          )}
        </dl>
      </AdminPanel>

      <AdminPanel className="p-5">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-700"><Wrench className="size-4" /></span>
          <div>
            <h3 className="text-[14px] font-bold text-slate-950">Runtime</h3>
            <p className="text-[11.5px] font-semibold text-slate-600">{data.runtime.env} · {data.runtime.region}</p>
          </div>
        </div>
        <dl className="mt-4 space-y-2 text-[13px]">
          <div className="flex justify-between"><dt className="text-slate-600">Node.js</dt><dd className="font-mono text-[12px] text-slate-950">{data.runtime.node}</dd></div>
          {data.runtime.commit && (
            <div className="flex justify-between"><dt className="text-slate-600">Commit</dt><dd className="font-mono text-[12px] text-slate-950">{data.runtime.commit}{data.runtime.commitBranch && ` · ${data.runtime.commitBranch}`}</dd></div>
          )}
          {data.runtime.deployedAt && (
            <div className="flex justify-between"><dt className="text-slate-600">Deploy</dt><dd className="text-[12px] text-slate-700">{new Date(Number(data.runtime.deployedAt)).toLocaleString("es-AR")}</dd></div>
          )}
        </dl>
      </AdminPanel>

      <AdminPanel className="p-5 md:col-span-2">
        <div className="flex items-center gap-2">
          <span className={`grid size-9 place-items-center rounded-lg ${data.encryption.configured ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}><ShieldCheck className="size-4" /></span>
          <div>
            <h3 className="text-[14px] font-bold text-slate-950">Cifrado de credenciales</h3>
            <p className="text-[12px] text-slate-600">{data.encryption.configured ? "CREDENTIAL_ENCRYPTION_KEY configurada correctamente. Podés guardar API keys desde la UI." : "Falta CREDENTIAL_ENCRYPTION_KEY en Vercel — sin esta variable la pestaña Integraciones no puede guardar credenciales."}</p>
          </div>
        </div>
        {!data.encryption.configured && (
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-[12px] text-slate-100">{`# Generá una clave aleatoria de 32 bytes en hex:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Cargá el output como CREDENTIAL_ENCRYPTION_KEY en Vercel y redeployá.`}</pre>
        )}
      </AdminPanel>
    </div>
  );
}
