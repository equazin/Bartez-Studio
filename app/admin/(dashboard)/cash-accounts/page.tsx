"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Ban, DollarSign, Landmark, Plus, Save, Wallet } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPagination,
  AdminPanel,
  AdminSpinner,
} from "../../../../components/admin/AdminUI";

interface CashAccount {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: string | number;
  active: boolean;
}

interface CashMovement {
  id: string;
  type: string;
  date: string;
  description: string;
  amount: string | number;
  currency: string;
  voidedAt: string | null;
  cashAccount: { id: string; name: string };
}

const ACCOUNT_TYPES = [
  { value: "bank", label: "Banco" },
  { value: "cash", label: "Caja" },
];

const MOVEMENT_TYPES = [
  { value: "income", label: "Ingreso" },
  { value: "expense", label: "Egreso" },
  { value: "adjust", label: "Ajuste" },
];

function money(currency: string, value: number | string) {
  return `${currency} ${Number(value).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CashAccountsPage() {
  const [accounts, setAccounts] = useState<CashAccount[]>([]);
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingMovement, setSavingMovement] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("bank");
  const [accountCurrency, setAccountCurrency] = useState<"ARS" | "USD">("ARS");
  const [openingBalance, setOpeningBalance] = useState("0");

  const [movementAccountId, setMovementAccountId] = useState("");
  const [movementType, setMovementType] = useState("expense");
  const [movementDescription, setMovementDescription] = useState("");
  const [movementAmount, setMovementAmount] = useState("");

  const [latestRate, setLatestRate] = useState<{ rate: string | number; date: string } | null>(null);
  const [rateInput, setRateInput] = useState("");
  const [savingRate, setSavingRate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accountsRes, movementsRes, rateRes] = await Promise.all([
        fetch("/api/admin/cash-accounts?limit=100"),
        fetch(`/api/admin/cash-movements?page=${page}&limit=${limit}`),
        fetch("/api/admin/exchange-rates"),
      ]);
      const accountsJson = await accountsRes.json();
      const movementsJson = await movementsRes.json();
      const rateJson = await rateRes.json();
      if (!accountsRes.ok || !accountsJson.ok) throw new Error(accountsJson.error || "No pudimos cargar cajas/bancos");
      if (!movementsRes.ok || !movementsJson.ok) throw new Error(movementsJson.error || "No pudimos cargar movimientos");
      setAccounts(accountsJson.data);
      setMovements(movementsJson.data);
      setTotal(movementsJson.meta.total);
      setMovementAccountId((current) => current || accountsJson.data[0]?.id || "");
      if (rateRes.ok && rateJson.ok) setLatestRate(rateJson.data.latest || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { void load(); }, [load]);

  const selectedAccount = useMemo(() => accounts.find((account) => account.id === movementAccountId), [accounts, movementAccountId]);

  async function createAccount() {
    if (!accountName.trim()) { setError("Ingresa el nombre de la caja o banco."); return; }
    setSavingAccount(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cash-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: accountName, type: accountType, currency: accountCurrency, balance: Number(openingBalance) || 0, active: true }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos crear la cuenta");
      setAccountName("");
      setOpeningBalance("0");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSavingAccount(false);
    }
  }

  async function saveRate() {
    const parsed = Number(rateInput);
    if (!parsed || parsed <= 0) { setError("Ingresa una cotización mayor a cero."); return; }
    setSavingRate(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/exchange-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base: "USD", quote: "ARS", rate: parsed }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos guardar la cotización");
      setRateInput("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSavingRate(false);
    }
  }

  async function voidMovement(id: string) {
    if (!confirm("¿Anular este movimiento? El saldo se corregirá automáticamente.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/cash-movements/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos anular el movimiento");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  async function createMovement() {
    if (!movementAccountId) { setError("Seleccioná una caja o banco."); return; }
    if (!movementDescription.trim()) { setError("Ingresa una descripcion."); return; }
    const parsedAmount = Number(movementAmount);
    if (!parsedAmount || parsedAmount <= 0) { setError("Ingresa un importe mayor a cero."); return; }
    setSavingMovement(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cash-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cashAccountId: movementAccountId,
          type: movementType,
          description: movementDescription,
          amount: parsedAmount,
          currency: selectedAccount?.currency || "ARS",
          referenceType: "manual",
          referenceId: null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos registrar el movimiento");
      setMovementDescription("");
      setMovementAmount("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSavingMovement(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div>
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Caja y bancos</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">Saldos de tesoreria y movimientos manuales.</p>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            {accounts.map((account) => (
              <AdminPanel key={account.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-slate-600">{account.type === "bank" ? "Banco" : "Caja"} / {account.currency}</p>
                    <p className="mt-1 text-[14px] font-bold text-slate-950">{account.name}</p>
                  </div>
                  <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${account.active ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{account.active ? "Activa" : "Inactiva"}</span>
                </div>
                <p className="mt-4 font-display text-[24px] font-bold text-slate-950">{money(account.currency, account.balance)}</p>
              </AdminPanel>
            ))}
            {!loading && accounts.length === 0 && (
              <AdminPanel className="p-8 text-center md:col-span-3">
                <Wallet className="mx-auto size-10 text-slate-400" />
                <p className="mt-4 text-[14px] font-bold text-slate-950">No hay cajas o bancos creados.</p>
              </AdminPanel>
            )}
          </div>

          <AdminPanel className="overflow-hidden">
            {loading ? (
              <div className="grid min-h-48 place-items-center"><AdminSpinner /></div>
            ) : movements.length === 0 ? (
              <div className="px-5 py-14 text-center"><Landmark className="mx-auto size-10 text-slate-400" /><p className="mt-4 text-[14px] font-bold text-slate-950">No hay movimientos de tesoreria.</p></div>
            ) : (
              <div>
                <div className="hidden grid-cols-[.55fr_.8fr_1.2fr_.6fr_.7fr_40px] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
                  <span>Fecha</span><span>Cuenta</span><span>Descripcion</span><span>Tipo</span><span>Importe</span><span />
                </div>
                {movements.map((movement) => (
                  <div key={movement.id} className={`grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[.55fr_.8fr_1.2fr_.6fr_.7fr_40px] lg:items-center lg:gap-3 ${movement.voidedAt ? "opacity-50" : ""}`}>
                    <p className="text-[12px] text-slate-600">{new Date(movement.date).toLocaleDateString("es-AR")}</p>
                    <p className="truncate text-[13px] font-bold text-slate-950">{movement.cashAccount.name}</p>
                    <p className="text-[13px] text-slate-700">{movement.description}{movement.voidedAt && <span className="ml-2 text-[11px] font-bold text-red-600">ANULADO</span>}</p>
                    <p className="text-[12.5px] font-bold text-slate-700">{MOVEMENT_TYPES.find((item) => item.value === movement.type)?.label || movement.type}</p>
                    <p className="text-[13px] font-bold text-slate-950">{money(movement.currency, movement.amount)}</p>
                    {!movement.voidedAt && (
                      <button onClick={() => void voidMovement(movement.id)} title="Anular movimiento" className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600">
                        <Ban className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </AdminPanel>
          {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}
        </div>

        <div className="grid content-start gap-5">
          <AdminPanel className="p-5">
            <div className="flex items-center gap-2">
              <DollarSign className="size-[18px] text-emerald-600" />
              <h2 className="font-display text-[17px] font-bold text-slate-950">Cotización del dólar</h2>
            </div>
            <p className="mt-2 text-[12.5px] text-slate-600">
              {latestRate
                ? <>Vigente: <b className="text-slate-950">USD 1 = ARS {Number(latestRate.rate).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</b> <span className="text-slate-500">({new Date(latestRate.date).toLocaleDateString("es-AR")})</span></>
                : "Todavía no cargaste ninguna cotización."}
            </p>
            <p className="mt-1 text-[12px] text-slate-600">Se autocompleta en facturas y pagos a proveedores en otra moneda.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <AdminField label="USD 1 = ARS" htmlFor="rate-input">
                <AdminInput id="rate-input" type="number" min="0" step="0.01" placeholder="Ej: 1050" value={rateInput} onChange={(event) => setRateInput(event.target.value)} />
              </AdminField>
              <AdminButton onClick={() => void saveRate()} disabled={savingRate}><Save />{savingRate ? "..." : "Guardar"}</AdminButton>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5">
            <h2 className="font-display text-[17px] font-bold text-slate-950">Nueva cuenta</h2>
            <div className="mt-4 grid gap-4">
              <AdminField label="Nombre" htmlFor="cash-name"><AdminInput id="cash-name" value={accountName} onChange={(event) => setAccountName(event.target.value)} /></AdminField>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Tipo" htmlFor="cash-type">
                  <select id="cash-type" value={accountType} onChange={(event) => setAccountType(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                    {ACCOUNT_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </AdminField>
                <AdminField label="Moneda" htmlFor="cash-currency">
                  <select id="cash-currency" value={accountCurrency} onChange={(event) => setAccountCurrency(event.target.value as "ARS" | "USD")} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                    <option value="ARS">ARS</option><option value="USD">USD</option>
                  </select>
                </AdminField>
              </div>
              <AdminField label="Saldo inicial" htmlFor="cash-balance"><AdminInput id="cash-balance" type="number" step="0.01" value={openingBalance} onChange={(event) => setOpeningBalance(event.target.value)} /></AdminField>
              <AdminButton onClick={() => void createAccount()} disabled={savingAccount}><Plus />{savingAccount ? "Creando..." : "Crear cuenta"}</AdminButton>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5">
            <h2 className="font-display text-[17px] font-bold text-slate-950">Nuevo movimiento</h2>
            <div className="mt-4 grid gap-4">
              <AdminField label="Caja/Banco" htmlFor="movement-account">
                <select id="movement-account" value={movementAccountId} onChange={(event) => setMovementAccountId(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                  <option value="">Seleccionar</option>
                  {accounts.map((account) => <option key={account.id} value={account.id}>{account.name} - {account.currency}</option>)}
                </select>
              </AdminField>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Tipo" htmlFor="movement-type">
                  <select id="movement-type" value={movementType} onChange={(event) => setMovementType(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                    {MOVEMENT_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </AdminField>
                <AdminField label="Importe" htmlFor="movement-amount"><AdminInput id="movement-amount" type="number" min="0" step="0.01" value={movementAmount} onChange={(event) => setMovementAmount(event.target.value)} /></AdminField>
              </div>
              <AdminField label="Descripcion" htmlFor="movement-description"><AdminInput id="movement-description" value={movementDescription} onChange={(event) => setMovementDescription(event.target.value)} /></AdminField>
              <AdminButton onClick={() => void createMovement()} disabled={savingMovement}><Save />{savingMovement ? "Guardando..." : "Registrar movimiento"}</AdminButton>
            </div>
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}
