"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2, ChevronLeft, Mail, Phone, Target, UserRound } from "lucide-react";
import { AdminPanel, AdminSpinner } from "../../../../../components/admin/AdminUI";

interface AccountDetail {
  id: string;
  name: string;
  taxId: string | null;
  industry: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  contacts: Array<{ id: string; firstName: string; lastName: string | null; email: string | null; phone: string | null; jobTitle: string | null }>;
  opportunities: Array<{ id: string; title: string; stage: string; amount: string | null; currency: string; probability: number; expectedClose: string | null }>;
  activities: Array<{ id: string; type: string; subject: string; status: string; dueAt: string | null }>;
  leads: Array<{ id: number; name: string; status: string }>;
}

const stageLabels: Record<string, string> = {
  qualification: "Calificación",
  proposal: "Propuesta",
  negotiation: "Negociación",
  won: "Ganada",
  lost: "Perdida",
};

const stageColors: Record<string, string> = {
  qualification: "bg-blue-50 text-blue-900 border-blue-200",
  proposal: "bg-amber-50 text-amber-900 border-amber-200",
  negotiation: "bg-purple-50 text-purple-900 border-purple-200",
  won: "bg-emerald-50 text-emerald-900 border-emerald-200",
  lost: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AccountDetailPage() {
  const params = useParams<{ id: string }>();
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/accounts/${params.id}`);
      const json = await res.json();
      setAccount(json.data);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!account) return <p className="py-20 text-center text-slate-600">Cuenta no encontrada.</p>;

  return (
    <div className="mx-auto max-w-[1240px]">
      <Link href="/admin/accounts" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a cuentas
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{account.name}</h1>
          <p className="mt-1 text-[13px] text-slate-600">
            {account.industry && <span>{account.industry}</span>}
            {account.city && <span>{account.industry ? " · " : ""}{account.city}</span>}
            {account.taxId && <span>{(account.industry || account.city) ? " · " : ""}CUIT {account.taxId}</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-[13px] text-slate-700">
          {account.email && <span className="inline-flex items-center gap-1.5"><Mail className="size-4" />{account.email}</span>}
          {account.phone && <span className="inline-flex items-center gap-1.5"><Phone className="size-4" />{account.phone}</span>}
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <AdminPanel className="overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-3.5 sm:px-6">
            <h2 className="font-display text-[16px] font-bold text-slate-950">Contactos</h2>
          </div>
          {account.contacts.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-slate-600">Sin contactos.</p>
          ) : (
            <div>
              {account.contacts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 border-b border-slate-200 px-5 py-3 last:border-0 sm:px-6">
                  <span className="grid size-9 flex-none place-items-center rounded-full bg-slate-100 text-slate-600"><UserRound className="size-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-slate-950">{c.firstName}{c.lastName ? ` ${c.lastName}` : ""}</p>
                    <p className="truncate text-[11.5px] text-slate-600">
                      {c.jobTitle ? `${c.jobTitle} · ` : ""}{c.email || c.phone || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-3.5 sm:px-6">
            <h2 className="font-display text-[16px] font-bold text-slate-950">Oportunidades</h2>
          </div>
          {account.opportunities.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-slate-600">Sin oportunidades.</p>
          ) : (
            <div>
              {account.opportunities.map((o) => (
                <div key={o.id} className="grid grid-cols-[1.4fr_.6fr_.5fr] items-center gap-3 border-b border-slate-200 px-5 py-3 last:border-0 sm:px-6">
                  <Link href={`/admin/opportunities`} className="truncate text-[13px] font-bold text-slate-950 hover:text-brand hover:underline">{o.title}</Link>
                  <span className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${stageColors[o.stage] || ""}`}>{stageLabels[o.stage] || o.stage}</span>
                  <span className="text-right text-[12px] font-medium text-slate-700">
                    {o.amount ? `${o.currency} ${Number(o.amount).toLocaleString()}` : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminPanel>

        <AdminPanel className="overflow-hidden lg:col-span-2">
          <div className="border-b border-slate-300 px-5 py-3.5 sm:px-6">
            <h2 className="font-display text-[16px] font-bold text-slate-950">Próximas actividades</h2>
          </div>
          {account.activities.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-slate-600">Sin actividades.</p>
          ) : (
            <div>
              {account.activities.map((a) => (
                <div key={a.id} className="grid grid-cols-[24px_1.4fr_.5fr_.5fr] items-center gap-3 border-b border-slate-200 px-5 py-3 last:border-0 sm:px-6">
                  <Target className="size-4 text-slate-500" />
                  <p className="truncate text-[13px] font-bold text-slate-950">{a.subject}</p>
                  <span className="text-[11.5px] uppercase tracking-wider text-slate-500">{a.type}</span>
                  <span className="text-right text-[12px] text-slate-600">{a.dueAt ? new Date(a.dueAt).toLocaleDateString("es-AR") : "—"}</span>
                </div>
              ))}
            </div>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
