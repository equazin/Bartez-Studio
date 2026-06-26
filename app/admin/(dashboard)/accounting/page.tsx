"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Ban, BookOpen, Plus, Save, Scale, Trash2 } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminSpinner,
} from "../../../../components/admin/AdminUI";

const TYPE_LABELS: Record<string, string> = {
  asset: "Activo",
  liability: "Pasivo",
  equity: "Patrimonio Neto",
  income: "Ingresos",
  expense: "Egresos",
};

interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: string;
  active: boolean;
}

interface JournalLineView {
  id: string;
  debit: string | number;
  credit: string | number;
  description: string | null;
  account: { code: string; name: string };
}

interface JournalEntryView {
  id: string;
  number: string;
  date: string;
  description: string;
  source: string;
  voidedAt: string | null;
  lines: JournalLineView[];
}

interface TrialRow {
  id: string;
  code: string;
  name: string;
  type: string;
  debit: number;
  credit: number;
  balance: number;
}

interface LedgerMovement {
  entryNumber: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

type Tab = "diario" | "plan" | "balance" | "mayor";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "diario", label: "Libro Diario", icon: BookOpen },
  { key: "plan", label: "Plan de Cuentas", icon: Plus },
  { key: "balance", label: "Balance", icon: Scale },
  { key: "mayor", label: "Libro Mayor", icon: BookOpen },
];

function money(value: number | string) {
  return `$ ${Number(value).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface DraftLine {
  accountId: string;
  debit: string;
  credit: string;
}

const emptyDraftLine: DraftLine = { accountId: "", debit: "", credit: "" };

export default function AccountingPage() {
  const [tab, setTab] = useState<Tab>("diario");
  const [accounts, setAccounts] = useState<LedgerAccount[]>([]);
  const [entries, setEntries] = useState<JournalEntryView[]>([]);
  const [trial, setTrial] = useState<{ rows: TrialRow[]; totalDebit: number; totalCredit: number } | null>(null);
  const [ledger, setLedger] = useState<{ account: LedgerAccount; movements: LedgerMovement[] } | null>(null);
  const [ledgerAccountId, setLedgerAccountId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Nuevo asiento
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryDescription, setEntryDescription] = useState("");
  const [draftLines, setDraftLines] = useState<DraftLine[]>([{ ...emptyDraftLine }, { ...emptyDraftLine }]);
  const [savingEntry, setSavingEntry] = useState(false);

  // Nueva cuenta
  const [accCode, setAccCode] = useState("");
  const [accName, setAccName] = useState("");
  const [accType, setAccType] = useState("asset");
  const [savingAccount, setSavingAccount] = useState(false);

  const loadBase = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accRes, entriesRes] = await Promise.all([
        fetch("/api/admin/ledger-accounts"),
        fetch("/api/admin/journal-entries?limit=50"),
      ]);
      const accJson = await accRes.json();
      const entriesJson = await entriesRes.json();
      if (!accRes.ok || !accJson.ok) throw new Error(accJson.error || "No pudimos cargar el plan de cuentas");
      setAccounts(accJson.data || []);
      if (entriesRes.ok && entriesJson.ok) setEntries(entriesJson.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadBase(); }, [loadBase]);

  const loadTrial = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/accounting/trial-balance");
      const json = await res.json();
      if (res.ok && json.ok) setTrial(json.data);
    } catch { /* noop */ }
  }, []);

  const loadLedger = useCallback(async (accountId: string) => {
    if (!accountId) { setLedger(null); return; }
    try {
      const res = await fetch(`/api/admin/accounting/ledger?accountId=${accountId}`);
      const json = await res.json();
      if (res.ok && json.ok) setLedger(json.data);
    } catch { /* noop */ }
  }, []);

  useEffect(() => { if (tab === "balance") void loadTrial(); }, [tab, loadTrial]);
  useEffect(() => { if (tab === "mayor" && ledgerAccountId) void loadLedger(ledgerAccountId); }, [tab, ledgerAccountId, loadLedger]);

  const draftTotals = useMemo(() => {
    const debit = draftLines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
    const credit = draftLines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
    return { debit: Math.round(debit * 100) / 100, credit: Math.round(credit * 100) / 100 };
  }, [draftLines]);
  const balanced = draftTotals.debit > 0 && draftTotals.debit === draftTotals.credit;

  function setDraftLine(idx: number, patch: Partial<DraftLine>) {
    setDraftLines((lines) => lines.map((line, i) => (i === idx ? { ...line, ...patch } : line)));
  }

  async function saveEntry() {
    if (!entryDescription.trim()) { setError("Ingresá una descripción del asiento."); return; }
    const lines = draftLines
      .filter((line) => line.accountId && (Number(line.debit) > 0 || Number(line.credit) > 0))
      .map((line) => ({ accountId: line.accountId, debit: Number(line.debit) || 0, credit: Number(line.credit) || 0 }));
    if (lines.length < 2) { setError("El asiento necesita al menos dos líneas con importe."); return; }
    if (!balanced) { setError("El asiento no balancea: el Debe debe igualar al Haber."); return; }
    setSavingEntry(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/journal-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: entryDate, description: entryDescription, lines }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos registrar el asiento");
      setEntryDescription("");
      setDraftLines([{ ...emptyDraftLine }, { ...emptyDraftLine }]);
      await loadBase();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSavingEntry(false);
    }
  }

  async function voidEntry(id: string) {
    if (!confirm("¿Anular este asiento?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/journal-entries/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos anular el asiento");
      await loadBase();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  async function saveAccount() {
    if (!accCode.trim() || !accName.trim()) { setError("Completá código y nombre de la cuenta."); return; }
    setSavingAccount(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ledger-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accCode, name: accName, type: accType }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos crear la cuenta");
      setAccCode("");
      setAccName("");
      await loadBase();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSavingAccount(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div>
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Contabilidad</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">Partida doble: plan de cuentas, asientos y reportes contables.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.key;
          return (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-bold transition ${active ? "border-brand bg-brand text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"}`}>
              <Icon className="size-4" />{item.label}
            </button>
          );
        })}
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}
      {loading && <div className="flex items-center justify-center py-20"><AdminSpinner /></div>}

      {!loading && tab === "diario" && (
        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_460px]">
          <AdminPanel className="overflow-hidden">
            <div className="border-b border-slate-300 px-5 py-4"><h2 className="font-display text-[17px] font-bold text-slate-950">Asientos</h2></div>
            {entries.length === 0 ? (
              <div className="px-5 py-14 text-center"><BookOpen className="mx-auto size-10 text-slate-400" /><p className="mt-4 text-[14px] font-bold text-slate-950">Todavía no hay asientos.</p></div>
            ) : (
              <div className="divide-y divide-slate-200">
                {entries.map((entry) => {
                  const total = entry.lines.reduce((sum, line) => sum + Number(line.debit), 0);
                  return (
                    <div key={entry.id} className={`px-5 py-4 ${entry.voidedAt ? "opacity-50" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[13px] font-bold text-slate-950">
                            <span className="font-mono">{entry.number}</span>
                            <span className="ml-2 font-normal text-slate-500">{new Date(entry.date).toLocaleDateString("es-AR")}</span>
                            {entry.source === "auto" && <span className="ml-2 rounded bg-blue-100 px-1.5 py-px text-[10px] font-bold text-blue-700">AUTO</span>}
                            {entry.voidedAt && <span className="ml-2 text-[11px] font-bold text-red-600">ANULADO</span>}
                          </p>
                          <p className="mt-0.5 text-[13px] text-slate-700">{entry.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-950">{money(total)}</span>
                          {!entry.voidedAt && (
                            <button onClick={() => void voidEntry(entry.id)} title="Anular asiento" className="flex size-7 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-600"><Ban className="size-3.5" /></button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2">
                        {entry.lines.map((line) => (
                          <div key={line.id} className="grid grid-cols-[1fr_auto_auto] gap-3 py-0.5 text-[12px]">
                            <span className="text-slate-700"><span className="font-mono text-slate-500">{line.account.code}</span> {line.account.name}</span>
                            <span className="w-24 text-right font-bold text-slate-950">{Number(line.debit) ? money(line.debit) : ""}</span>
                            <span className="w-24 text-right text-slate-600">{Number(line.credit) ? money(line.credit) : ""}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AdminPanel>

          <AdminPanel className="p-5">
            <h2 className="font-display text-[17px] font-bold text-slate-950">Nuevo asiento</h2>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Fecha" htmlFor="entry-date"><AdminInput id="entry-date" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} /></AdminField>
              </div>
              <AdminField label="Descripción" htmlFor="entry-desc"><AdminInput id="entry-desc" value={entryDescription} onChange={(e) => setEntryDescription(e.target.value)} placeholder="Ej: Cobro factura A-0001" /></AdminField>
              <div className="rounded-lg border border-slate-300">
                <div className="grid grid-cols-[1fr_90px_90px_28px] gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-600">
                  <span>Cuenta</span><span className="text-right">Debe</span><span className="text-right">Haber</span><span />
                </div>
                <div className="grid gap-2 p-3">
                  {draftLines.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_90px_90px_28px] items-center gap-2">
                      <select value={line.accountId} onChange={(e) => setDraftLine(idx, { accountId: e.target.value })} className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-[12px]">
                        <option value="">Cuenta…</option>
                        {accounts.filter((a) => a.code.includes(".")).map((a) => <option key={a.id} value={a.id}>{a.code} {a.name}</option>)}
                      </select>
                      <AdminInput type="number" min="0" step="0.01" value={line.debit} onChange={(e) => setDraftLine(idx, { debit: e.target.value, credit: "" })} />
                      <AdminInput type="number" min="0" step="0.01" value={line.credit} onChange={(e) => setDraftLine(idx, { credit: e.target.value, debit: "" })} />
                      <button onClick={() => setDraftLines((lines) => lines.length > 2 ? lines.filter((_, i) => i !== idx) : lines)} className="flex size-7 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2">
                  <button onClick={() => setDraftLines((lines) => [...lines, { ...emptyDraftLine }])} className="text-[12px] font-bold text-brand hover:underline">+ Agregar línea</button>
                  <span className={`text-[12px] font-bold ${balanced ? "text-emerald-600" : "text-slate-500"}`}>Debe {money(draftTotals.debit)} / Haber {money(draftTotals.credit)}{balanced ? " ✓" : ""}</span>
                </div>
              </div>
              <AdminButton onClick={() => void saveEntry()} disabled={savingEntry || !balanced}><Save />{savingEntry ? "Guardando..." : "Registrar asiento"}</AdminButton>
            </div>
          </AdminPanel>
        </div>
      )}

      {!loading && tab === "plan" && (
        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_400px]">
          <AdminPanel className="overflow-hidden">
            <div className="border-b border-slate-300 px-5 py-4"><h2 className="font-display text-[17px] font-bold text-slate-950">Plan de cuentas</h2></div>
            <div className="divide-y divide-slate-100">
              {accounts.map((account) => {
                const isGroup = !account.code.includes(".");
                return (
                  <div key={account.id} className={`flex items-center justify-between px-5 py-2.5 ${isGroup ? "bg-slate-50" : ""}`}>
                    <span className={`text-[13px] ${isGroup ? "font-bold text-slate-950" : "text-slate-700"}`}>
                      <span className="mr-2 font-mono text-slate-500">{account.code}</span>{account.name}
                    </span>
                    <span className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-600">{TYPE_LABELS[account.type]}</span>
                  </div>
                );
              })}
            </div>
          </AdminPanel>
          <AdminPanel className="p-5">
            <h2 className="font-display text-[17px] font-bold text-slate-950">Nueva cuenta</h2>
            <div className="mt-4 grid gap-4">
              <AdminField label="Código" htmlFor="acc-code"><AdminInput id="acc-code" value={accCode} onChange={(e) => setAccCode(e.target.value)} placeholder="Ej: 5.1.05" /></AdminField>
              <AdminField label="Nombre" htmlFor="acc-name"><AdminInput id="acc-name" value={accName} onChange={(e) => setAccName(e.target.value)} placeholder="Ej: Gastos de Movilidad" /></AdminField>
              <AdminField label="Tipo" htmlFor="acc-type">
                <select id="acc-type" value={accType} onChange={(e) => setAccType(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                  {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </AdminField>
              <AdminButton onClick={() => void saveAccount()} disabled={savingAccount}><Plus />{savingAccount ? "Creando..." : "Crear cuenta"}</AdminButton>
            </div>
          </AdminPanel>
        </div>
      )}

      {!loading && tab === "balance" && (
        <AdminPanel className="mt-5 overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-4"><h2 className="font-display text-[17px] font-bold text-slate-950">Balance de Sumas y Saldos</h2></div>
          {!trial ? (
            <div className="flex items-center justify-center py-16"><AdminSpinner /></div>
          ) : (
            <div>
              <div className="hidden grid-cols-[.5fr_1.4fr_.7fr_.7fr_.7fr] gap-3 border-b border-slate-300 bg-slate-100 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-600 lg:grid">
                <span>Código</span><span>Cuenta</span><span className="text-right">Debe</span><span className="text-right">Haber</span><span className="text-right">Saldo</span>
              </div>
              {trial.rows.filter((row) => row.debit > 0 || row.credit > 0).map((row) => (
                <div key={row.id} className="grid gap-2 border-b border-slate-100 px-5 py-2.5 lg:grid-cols-[.5fr_1.4fr_.7fr_.7fr_.7fr] lg:items-center">
                  <span className="font-mono text-[12px] text-slate-500">{row.code}</span>
                  <span className="text-[13px] text-slate-800">{row.name}</span>
                  <span className="text-right text-[13px] text-slate-700">{row.debit ? money(row.debit) : "-"}</span>
                  <span className="text-right text-[13px] text-slate-700">{row.credit ? money(row.credit) : "-"}</span>
                  <span className="text-right text-[13px] font-bold text-slate-950">{money(row.balance)}</span>
                </div>
              ))}
              <div className="grid grid-cols-[.5fr_1.4fr_.7fr_.7fr_.7fr] gap-3 border-t-2 border-slate-300 bg-slate-50 px-5 py-3 text-[13px] font-bold text-slate-950">
                <span /><span className="text-right">Totales</span>
                <span className="text-right">{money(trial.totalDebit)}</span>
                <span className="text-right">{money(trial.totalCredit)}</span>
                <span className={`text-right ${trial.totalDebit === trial.totalCredit ? "text-emerald-600" : "text-red-600"}`}>{trial.totalDebit === trial.totalCredit ? "Balanceado ✓" : "Desbalance"}</span>
              </div>
            </div>
          )}
        </AdminPanel>
      )}

      {!loading && tab === "mayor" && (
        <div className="mt-5">
          <AdminPanel className="p-5">
            <AdminField label="Cuenta" htmlFor="ledger-account">
              <select id="ledger-account" value={ledgerAccountId} onChange={(e) => setLedgerAccountId(e.target.value)} className="h-10 w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                <option value="">Seleccionar cuenta…</option>
                {accounts.filter((a) => a.code.includes(".")).map((a) => <option key={a.id} value={a.id}>{a.code} {a.name}</option>)}
              </select>
            </AdminField>
          </AdminPanel>
          {ledger && (
            <AdminPanel className="mt-5 overflow-hidden">
              <div className="border-b border-slate-300 px-5 py-4"><h2 className="font-display text-[17px] font-bold text-slate-950">{ledger.account.code} · {ledger.account.name}</h2></div>
              {ledger.movements.length === 0 ? (
                <div className="px-5 py-14 text-center text-[13px] font-bold text-slate-700">Sin movimientos en esta cuenta.</div>
              ) : (
                <div>
                  <div className="hidden grid-cols-[.6fr_.7fr_1.4fr_.7fr_.7fr_.7fr] gap-3 border-b border-slate-300 bg-slate-100 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-600 lg:grid">
                    <span>Asiento</span><span>Fecha</span><span>Detalle</span><span className="text-right">Debe</span><span className="text-right">Haber</span><span className="text-right">Saldo</span>
                  </div>
                  {ledger.movements.map((mov, idx) => (
                    <div key={idx} className="grid gap-2 border-b border-slate-100 px-5 py-2.5 lg:grid-cols-[.6fr_.7fr_1.4fr_.7fr_.7fr_.7fr] lg:items-center">
                      <span className="font-mono text-[12px] text-slate-500">{mov.entryNumber}</span>
                      <span className="text-[12px] text-slate-600">{new Date(mov.date).toLocaleDateString("es-AR")}</span>
                      <span className="text-[13px] text-slate-800">{mov.description}</span>
                      <span className="text-right text-[13px] text-slate-700">{mov.debit ? money(mov.debit) : "-"}</span>
                      <span className="text-right text-[13px] text-slate-700">{mov.credit ? money(mov.credit) : "-"}</span>
                      <span className="text-right text-[13px] font-bold text-slate-950">{money(mov.balance)}</span>
                    </div>
                  ))}
                </div>
              )}
            </AdminPanel>
          )}
        </div>
      )}
    </div>
  );
}
